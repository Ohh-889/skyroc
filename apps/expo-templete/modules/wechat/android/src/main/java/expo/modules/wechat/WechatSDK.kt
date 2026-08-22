package expo.modules.wechat

import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.util.Log
import com.tencent.mm.opensdk.modelbase.BaseReq
import com.tencent.mm.opensdk.modelbase.BaseResp
import com.tencent.mm.opensdk.modelmsg.SendAuth
import com.tencent.mm.opensdk.modelmsg.SendMessageToWX
import com.tencent.mm.opensdk.openapi.IWXAPI
import com.tencent.mm.opensdk.openapi.IWXAPIEventHandler
import com.tencent.mm.opensdk.openapi.WXAPIFactory
import expo.modules.kotlin.Promise

private const val TAG = "WechatSDK"

/**
 * 微信 SDK 的单例桥接层，行为和 iOS 的 `WechatSDK` 一一对应。
 *
 * 只负责四件事：注册、把 `onResp` 路由到对应的功能、维护挂起的 Promise、回前台兜底。
 * 具体某个功能怎么构造请求、怎么解析响应，都在 `Wechat*Request.kt` 里。
 *
 * 之所以是单例：微信的回调走 `${applicationId}.wxapi.WXEntryActivity`（由 config plugin
 * 生成），那个 Activity 的生命周期独立于 React 模块，状态必须挂在能跨两者存活的地方。
 *
 * **线程模型**：所有可变状态只在主线程读写，每个入口自己负责切过去，调用方在哪条线程都无所谓。
 * 和 iOS 一样选主线程而不是私有队列——`sendReq` 会拉起微信、`onResp` 也在主线程回调。
 */
object WechatSDK : IWXAPIEventHandler {
  /** 从微信切回来后，等多久还没收到回调就判定这次请求没有结果 */
  const val DEFAULT_RESUME_GRACE_MS = 500L
  private const val MIN_RESUME_GRACE_MS = 100L
  private const val MAX_RESUME_GRACE_MS = 5_000L

  private val mainHandler = Handler(Looper.getMainLooper())

  /** 模块实例，用来把结果以事件形式广播给 JS；模块销毁时置空 */
  var module: WechatModule? = null

  // 以下状态一律主线程独占
  private var api: IWXAPI? = null
  private var appId: String? = null
  private val pending = mutableMapOf<WechatRespKind, Promise>()
  private val buffered = mutableMapOf<WechatRespKind, Result<Bundle>>()
  private val claimed = mutableSetOf<WechatRespKind>()
  private var didLeaveApp = false
  private var resumeGraceMs = DEFAULT_RESUME_GRACE_MS

  // MARK: - 注册

  fun register(context: Context) {
    onMain { registerIfNeeded(context) }
  }

  fun attach(module: WechatModule) {
    onMain { this.module = module }
  }

  fun detach() {
    onMain { this.module = null }
  }

  // MARK: - 对外能力

  fun checkInstalled(context: Context, completion: (Boolean) -> Unit) {
    onMain { completion(registerIfNeeded(context)?.isWXAppInstalled == true) }
  }

  fun openWechat(context: Context, completion: (Boolean) -> Unit) {
    onMain { completion(registerIfNeeded(context)?.openWXApp() == true) }
  }

  /**
   * 对齐 iOS 的 `getApiVersion`。
   * Android SDK 给的是一个整型的支持版本号（`getWXAppSupportAPI`），不是 SDK 版本串，
   * 这里原样转成字符串返回，报障时提供给微信技术支持用。
   */
  fun apiVersion(context: Context, completion: (String) -> Unit) {
    onMain { completion(registerIfNeeded(context)?.wxAppSupportAPI?.toString() ?: "0") }
  }

  fun setResumeGrace(milliseconds: Double, completion: (Double) -> Unit) {
    onMain {
      val clamped = milliseconds.toLong().coerceIn(MIN_RESUME_GRACE_MS, MAX_RESUME_GRACE_MS)
      resumeGraceMs = clamped
      completion(clamped.toDouble())
    }
  }

  /** 占住某种 resp 类型的槽并把请求发给微信。新功能只要调这一个方法。 */
  fun send(context: Context, req: BaseReq, kind: WechatRespKind, promise: Promise) {
    onMain {
      val wxapi = registerIfNeeded(context)
      if (wxapi == null) {
        fail(kind, "ERR_WECHAT_NOT_CONFIGURED", "微信 SDK 未注册，请检查 app.config.ts 里的 wechat 插件配置", promise)
        return@onMain
      }
      if (!wxapi.isWXAppInstalled) {
        fail(kind, "ERR_WECHAT_NOT_INSTALLED", "未安装微信客户端", promise)
        return@onMain
      }
      if (pending[kind] != null) {
        fail(kind, "ERR_WECHAT_PENDING", "上一次微信请求（${kind.value}）尚未结束", promise)
        return@onMain
      }

      pending[kind] = promise
      claimed.add(kind)
      didLeaveApp = false

      wxapi.sendReq(req) { success ->
        onMain {
          // 第一段回调：请求已经交给微信，App 此时正在（或即将）切走
          module?.emit("onRequestSent", Bundle().apply {
            putString("kind", kind.value)
            putBoolean("ok", success)
          })

          if (!success) {
            settle(kind, Result.failure(WechatError("ERR_WECHAT_REQUEST_NOT_SENT", "请求没能送达微信")))
          }
        }
      }
    }
  }

  /** 取走冷启动期间缓存的结果（取一次即清空） */
  fun consumeBuffered(kind: WechatRespKind, completion: (Bundle?) -> Unit) {
    onMain {
      val result = buffered.remove(kind)
      completion(result?.let { encode(kind, it) })
    }
  }

  // MARK: - 生命周期兜底

  fun handleEntersBackground() {
    onMain { if (pending.isNotEmpty()) didLeaveApp = true }
  }

  /**
   * 用户在微信里按了返回键、或直接把微信划掉而没完成操作时，App 永远收不到 `onResp`。
   * 不兜底的话槽会被永久占住，之后每次请求都直接 `ERR_WECHAT_PENDING`，只能重启 App。
   */
  fun handleEntersForeground() {
    onMain {
      if (!didLeaveApp) return@onMain
      didLeaveApp = false

      // 正常回调（WXEntryActivity）通常紧跟其后到达，先给它一点时间
      mainHandler.postDelayed({
        pending.keys.toList().forEach { kind ->
          settle(kind, Result.failure(WechatError("ERR_WECHAT_NO_RESPONSE", "从微信返回后没有等到结果")))
        }
      }, resumeGraceMs)
    }
  }

  /** 由生成的 WXEntryActivity 调用 */
  fun handleIntent(context: Context, intent: Intent): Boolean =
    registerIfNeeded(context)?.handleIntent(intent, this) == true

  // MARK: - IWXAPIEventHandler

  /**
   * 微信主动发起的请求（从小程序返回 App、点击分享出去的卡片等）。
   * 只做登录和分享用不到，先留空——注意留空和不实现在运行时等价，写出来是为了说明「不是漏了」。
   */
  override fun onReq(req: BaseReq?) = Unit

  override fun onResp(resp: BaseResp?) {
    // 接新功能 = 在这里加一个分支，其余路由代码不动
    when (resp) {
      is SendAuth.Resp -> settle(WechatAuthRequest.kind, WechatAuthRequest.makeResult(resp))
      is SendMessageToWX.Resp -> settle(WechatShareRequest.kind, WechatShareRequest.makeResult(resp))
      else -> Log.w(TAG, "收到未处理的响应类型：${resp?.javaClass?.simpleName}")
    }
  }

  // MARK: - Private

  /** 请求还没发出去就失败时走这里，保证 JS 侧拿到的形状和正常结果完全一致 */
  fun fail(kind: WechatRespKind, code: String, message: String, promise: Promise) {
    promise.resolve(encode(kind, Result.failure(WechatError(code, message))))
  }

  private fun settle(kind: WechatRespKind, result: Result<Bundle>) {
    onMain {
      // 事件是全量观察通道，成功失败都发；正常流程请用 Promise，两者会同时触发
      module?.emit("onResponse", encode(kind, result))

      val promise = pending.remove(kind)
      if (promise == null) {
        // 没人认领分两种情况，只有前一种该缓存：
        // 1. 冷启动——resp 早于 JS bundle 加载，JS 起来要主动取
        // 2. 超时结掉后迟到的回调——上层已经拿到 ERR_WECHAT_NO_RESPONSE 了，
        //    再缓存会在下次 consume 时变成「没分享却提示成功」的脏数据
        if (!claimed.contains(kind)) {
          buffered[kind] = result
        }
        return@onMain
      }

      // 关键：不 reject。用户取消是正常的流程分支，统一 resolve 成同一个形状
      promise.resolve(encode(kind, result))
    }
  }

  /**
   * 两个分支都带齐全部字段，缺的显式塞 null。
   * 不这么写的话，成功时 JS 侧拿到的 `code` 是 `undefined` 而不是 `null`，
   * 直接解构和统一上报都会别扭。和 iOS 的 `encode` 保持一致。
   */
  private fun encode(kind: WechatRespKind, result: Result<Bundle>): Bundle {
    val encoded = Bundle().apply { putString("kind", kind.value) }
    result.fold(
      onSuccess = {
        encoded.putBoolean("ok", true)
        encoded.putBundle("payload", it)
        encoded.putString("code", null)
        encoded.putString("message", null)
      },
      onFailure = { error ->
        val wechatError = error as? WechatError
        encoded.putBoolean("ok", false)
        encoded.putBundle("payload", null)
        encoded.putString("code", wechatError?.code ?: "ERR_WECHAT_FAILED")
        encoded.putString("message", error.message ?: "微信请求失败")
      }
    )
    return encoded
  }

  /** 主线程独占状态，所以每个入口都过这一道 */
  private inline fun onMain(crossinline work: () -> Unit) {
    if (Looper.myLooper() == Looper.getMainLooper()) {
      work()
    } else {
      mainHandler.post { work() }
    }
  }

  private fun registerIfNeeded(context: Context): IWXAPI? {
    api?.let { return it }

    val id = appId ?: readAppId(context)
    if (id.isNullOrEmpty()) {
      Log.w(TAG, "AndroidManifest 缺少 meta-data WX_APP_ID，跳过微信 SDK 注册")
      return null
    }

    appId = id
    val created = WXAPIFactory.createWXAPI(context.applicationContext, id, true)
    if (!created.registerApp(id)) {
      Log.w(TAG, "registerApp 失败，appId=$id")
    }
    api = created
    return created
  }

  private fun readAppId(context: Context): String? = runCatching {
    val info = context.packageManager.getApplicationInfo(context.packageName, PackageManager.GET_META_DATA)
    info.metaData?.getString("WX_APP_ID")
  }.getOrNull()
}
