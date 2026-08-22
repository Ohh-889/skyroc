package expo.modules.wechat

import android.content.Context
import android.os.Bundle
import com.tencent.mm.opensdk.modelbase.BaseReq
import expo.modules.kotlin.Promise
import expo.modules.kotlin.exception.Exceptions
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class WechatModule : Module() {
  private val context: Context
    get() = appContext.reactContext ?: throw Exceptions.ReactContextLost()

  /** 给 WechatSDK 用的事件出口；模块之外的对象拿不到 sendEvent */
  fun emit(name: String, payload: Bundle) {
    sendEvent(name, payload)
  }

  /**
   * 把一次分享跑完：后台线程准备请求（可能要下载媒体）→ 交给 WechatSDK 发出去。
   *
   * 准备阶段的失败（缺字段、下载失败、超限）也走统一的 WechatResult 格式返回，
   * 不抛异常、也不会占住 pending 槽，调用方可以直接重试。
   */
  private fun runShare(promise: Promise, makeRequest: () -> BaseReq) {
    WechatMediaLoader.async {
      try {
        val req = makeRequest()
        WechatSDK.send(context, req, WechatShareRequest.kind, promise)
      } catch (error: WechatError) {
        WechatSDK.fail(WechatShareRequest.kind, error.code, error.message, promise)
      } catch (error: Exception) {
        WechatSDK.fail(
          WechatShareRequest.kind,
          "ERR_WECHAT_SHARE_PREPARE_FAILED",
          error.message ?: error.javaClass.simpleName,
          promise
        )
      }
    }
  }

  override fun definition() = ModuleDefinition {
    Name("Wechat")

    // onRequestSent 是第一段（已唤起微信），onResponse 是第二段（微信真正的结果）
    Events("onRequestSent", "onResponse")

    OnCreate {
      WechatSDK.attach(this@WechatModule)
      WechatSDK.register(context)
    }

    OnDestroy {
      WechatSDK.detach()
    }

    // 对齐 iOS 的 AppDelegate 兜底：用户切到微信没完成操作就回来，不然槽会被永久占住
    OnActivityEntersBackground {
      WechatSDK.handleEntersBackground()
    }

    OnActivityEntersForeground {
      WechatSDK.handleEntersForeground()
    }

    // 所有方法都不用关心线程：WechatSDK 内部自己切主线程
    AsyncFunction("isWechatInstalledAsync") { promise: Promise ->
      WechatSDK.checkInstalled(context) { promise.resolve(it) }
    }

    AsyncFunction("openWechatAsync") { promise: Promise ->
      WechatSDK.openWechat(context) { promise.resolve(it) }
    }

    AsyncFunction("getApiVersionAsync") { promise: Promise ->
      WechatSDK.apiVersion(context) { promise.resolve(it) }
    }

    AsyncFunction("getInstallUrlAsync") { promise: Promise ->
      // Android SDK 没有 iOS 的 getWXAppInstallUrl，给一个官方下载页兜底
      promise.resolve("https://weixin.qq.com/")
    }

    AsyncFunction("checkUniversalLinkAsync") { promise: Promise ->
      // Universal Link 是 iOS 独有的回跳机制，Android 走 WXEntryActivity，没有对应的自检
      promise.resolve(
        Bundle().apply {
          putBoolean("ok", true)
          putString("message", "Android 不使用 Universal Link，无需自检（回跳走 WXEntryActivity）")
          putParcelableArray("steps", emptyArray())
        }
      )
    }

    AsyncFunction("setResumeGraceMsAsync") { milliseconds: Double, promise: Promise ->
      WechatSDK.setResumeGrace(milliseconds) { promise.resolve(it) }
    }

    // MARK: 登录授权

    AsyncFunction("sendAuthAsync") { scope: String, state: String?, promise: Promise ->
      WechatSDK.send(context, WechatAuthRequest.makeRequest(scope, state), WechatAuthRequest.kind, promise)
    }

    AsyncFunction("consumePendingAuthResponseAsync") { promise: Promise ->
      WechatSDK.consumeBuffered(WechatAuthRequest.kind) { promise.resolve(it) }
    }

    // MARK: 分享与收藏

    AsyncFunction("shareTextAsync") { options: ShareTextOptions, promise: Promise ->
      runShare(promise) { WechatShareRequest.makeRequest(options) }
    }

    AsyncFunction("shareImageAsync") { options: ShareImageOptions, promise: Promise ->
      runShare(promise) { WechatShareRequest.makeRequest(options) }
    }

    AsyncFunction("shareWebpageAsync") { options: ShareWebpageOptions, promise: Promise ->
      runShare(promise) { WechatShareRequest.makeRequest(options) }
    }

    AsyncFunction("shareVideoAsync") { options: ShareVideoOptions, promise: Promise ->
      runShare(promise) { WechatShareRequest.makeRequest(options) }
    }

    AsyncFunction("shareMusicAsync") { options: ShareMusicOptions, promise: Promise ->
      runShare(promise) { WechatShareRequest.makeRequest(options) }
    }

    AsyncFunction("shareMusicVideoAsync") { options: ShareMusicVideoOptions, promise: Promise ->
      runShare(promise) { WechatShareRequest.makeRequest(context, options) }
    }

    AsyncFunction("shareFileAsync") { options: ShareFileOptions, promise: Promise ->
      runShare(promise) { WechatShareRequest.makeRequest(options) }
    }

    AsyncFunction("shareEmoticonAsync") { options: ShareEmoticonOptions, promise: Promise ->
      runShare(promise) { WechatShareRequest.makeRequest(options) }
    }

    AsyncFunction("shareMiniProgramAsync") { options: ShareMiniProgramOptions, promise: Promise ->
      runShare(promise) { WechatShareRequest.makeRequest(options) }
    }

    AsyncFunction("consumePendingShareResponseAsync") { promise: Promise ->
      WechatSDK.consumeBuffered(WechatShareRequest.kind) { promise.resolve(it) }
    }
  }
}
