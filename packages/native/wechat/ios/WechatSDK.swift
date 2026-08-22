import ExpoModulesCore
import WechatOpenSDK

/// 一次微信交互的结果：成功给 payload，失败给统一错误
typealias WechatResult = Result<[String: Any], WechatError>

/// 微信 SDK 的单例桥接层。
///
/// 只负责三件事：注册、把 `onResp` 路由到对应的功能、维护挂起的 Promise。
/// 具体某个功能怎么构造请求、怎么解析响应，都在 `Wechat*Request.swift` 里。
///
/// **线程模型**：所有可变状态只在主线程读写，每个方法自己负责切过去，
/// 调用方在哪条队列都无所谓。选主线程而不是另开私有队列，是因为 WXApi 的调用
/// 本来就必须在主线程（`registerApp` 头文件明写，`isWXAppInstalled` 走 canOpenURL，
/// `sendReq` 会切 App），`onResp` 也由 AppDelegate 在主线程回调——
/// 再引入第二条队列等于两个状态域，反而要来回跳。
final class WechatSDK: NSObject, WXApiDelegate {
  static let shared = WechatSDK()

  /// 从微信切回来后，等多久还没收到回调就判定这次请求没有结果。
  ///
  /// 只影响「没在微信里完成操作」这一条路径——正常点了确认或取消的话，
  /// 微信会立刻回调 `onResp`，槽当场清空，这个定时器跑到时已经无事可做。
  /// 实测 Universal Link 回调和 didBecomeActive 的间隔在 100ms 以内，0.5s 留够了余量；
  /// 但这个值取决于具体的 Universal Link 配置和机器性能，所以开放给上层调。
  static let defaultResumeGraceInterval: TimeInterval = 0.5
  private static let resumeGraceRange: ClosedRange<TimeInterval> = 0.1...5

  /// 自检要来回切一次微信，给足时间；超了就当没配好
  private static let universalLinkCheckTimeout: TimeInterval = 30

  /// 只在主线程读写，和其它状态一致
  private var resumeGraceInterval = WechatSDK.defaultResumeGraceInterval

  /// 上层可调，超出 [100ms, 5s] 会被钳到边界并返回实际生效值。
  /// 太小会把还在路上的正常回调误判成没有结果，太大则让用户干等。
  func setResumeGrace(seconds: Double, completion: @escaping (Double) -> Void) {
    onMain {
      let clamped = min(max(seconds, Self.resumeGraceRange.lowerBound), Self.resumeGraceRange.upperBound)
      self.resumeGraceInterval = clamped
      completion(clamped)
    }
  }

  // 以下状态一律主线程独占
  private weak var module: WechatModule?
  private(set) var appId: String?
  private var isRegistered = false
  /// 每种 resp 类型一个槽，存放等待认领的 Promise
  private var pending: [WechatRespKind: Promise] = [:]
  /// 结果先于 JS 到达（冷启动）时的缓存，成功和失败都要留，否则 JS 分不清「取消了」和「压根没发起」
  private var buffered: [WechatRespKind: WechatResult] = [:]
  /// 本次 App 生命周期内，哪些 kind 已经由 JS 挂过 Promise。
  /// 用来区分两种「没人认领」：冷启动（JS 还没起来，该缓存）
  /// 和超时结掉后迟到的回调（已经给过结果了，再缓存就成了下次的脏数据）。
  private var claimed: Set<WechatRespKind> = []
  /// 请求发出后 App 是否真的切走过，用来区分「从微信回来」和「本地弹窗导致的 becomeActive」
  private var didLeaveApp = false

  // MARK: - 注册

  /// 从 Info.plist 读配置并注册，重复调用无副作用。
  ///
  /// 必须早于任何回调，所以入口在 `WechatAppDelegateSubscriber` 的 `didFinishLaunching`，
  /// 而不是等 JS 调 registerApp——App 被系统杀掉后从微信返回时，回调会早于 JS bundle 加载。
  func register() {
    onMain { _ = self.registerIfNeeded() }
  }

  func attach(module: WechatModule) {
    onMain { self.module = module }
  }

  func detach() {
    onMain { self.module = nil }
  }

  // MARK: - 对外能力

  func checkInstalled(_ completion: @escaping (Bool) -> Void) {
    onMain { completion(WXApi.isWXAppInstalled()) }
  }

  func openWechat(_ completion: @escaping (Bool) -> Void) {
    onMain { completion(WXApi.openWXApp()) }
  }

  /// 当前微信 SDK 的版本号，排查兼容性问题时报给微信技术支持用
  func apiVersion(_ completion: @escaping (String) -> Void) {
    onMain { completion(WXApi.getVersion()) }
  }

  /// 微信在 App Store 的安装地址，由 SDK 给出，比自己写死链接可靠
  func installUrl(_ completion: @escaping (String) -> Void) {
    onMain { completion(WXApi.getWXAppInstallUrl()) }
  }

  /// Universal Link 自检。
  ///
  /// 微信这个接口有三个坑，都在这里处理掉了：
  /// 1. **会多次回调**（每个检测步骤一次），而 Promise 只能 settle 一次
  /// 2. **会真的把微信拉起来再跳回本 App**（LaunchWechat / BackToCurrentApp 两步）
  /// 3. 某一步卡住就再也不回调了，Promise 会永久挂着——所以加了超时兜底
  ///
  /// 头文件明确写了「仅用于新接入 SDK 时调试使用，请勿在正式环境的调用」。
  func checkUniversalLink(_ completion: @escaping ([String: Any]) -> Void) {
    onMain {
      guard self.registerIfNeeded() else {
        completion([
          "ok": false,
          "steps": [],
          "message": "微信 SDK 未注册，自检必须在 registerApp 成功之后进行"
        ])
        return
      }

      var steps: [[String: Any]] = []
      var settled = false

      let finish: (Bool, String) -> Void = { ok, message in
        guard !settled else { return }
        settled = true
        completion(["ok": ok, "steps": steps, "message": message])
      }

      DispatchQueue.main.asyncAfter(deadline: .now() + Self.universalLinkCheckTimeout) {
        finish(false, "自检超时：某个步骤没有回调，通常卡在拉起微信或从微信返回这两步")
      }

      WXApi.checkUniversalLinkReady { step, result in
        // 微信没承诺回调在哪条线程，steps 只在主线程累加
        self.onMain {
          let errorInfo = Self.ulText(result, "errorInfo")
          let suggestion = Self.ulText(result, "suggestion")

          steps.append([
            "step": Self.stepName(step),
            "success": result.success,
            "errorInfo": errorInfo,
            "suggestion": suggestion
          ])

          if !result.success {
            finish(false, errorInfo.orIfEmpty("Universal Link 自检未通过"))
          } else if step == .final {
            finish(true, "Universal Link 配置正常")
          }
        }
      }
    }
  }

  /// 占住某种 resp 类型的槽并把请求发给微信。新功能只要调这一个方法。
  func send(_ req: BaseReq, kind: WechatRespKind, promise: Promise) {
    onMain {
      guard self.registerIfNeeded() else {
        self.fail(kind, "ERR_WECHAT_NOT_CONFIGURED", "微信 SDK 未注册，请检查 app.config.ts 里的 wechat 插件配置", promise)
        return
      }
      guard WXApi.isWXAppInstalled() else {
        self.fail(kind, "ERR_WECHAT_NOT_INSTALLED", "未安装微信客户端", promise)
        return
      }
      guard self.pending[kind] == nil else {
        self.fail(kind, "ERR_WECHAT_PENDING", "上一次微信请求（\(kind.rawValue)）尚未结束", promise)
        return
      }

      self.pending[kind] = promise
      self.claimed.insert(kind)
      self.didLeaveApp = false

      // 微信没承诺 completion 回在哪条线程，onMain 收回来
      WXApi.send(req) { success in
        self.onMain {
          // 第一段回调：请求已经交给微信，App 此时正在（或即将）切走。
          // 到这里为止的耗时是「我们这边」的——下载媒体、压缩缩略图；
          // 之后的耗时才是「用户在微信里操作」的，上层可以据此区分 loading 文案。
          self.module?.sendEvent("onRequestSent", ["kind": kind.rawValue, "ok": success])

          guard !success else { return }
          self.settle(kind, .failure(WechatError(code: "ERR_WECHAT_REQUEST_NOT_SENT", message: "请求没能送达微信")))
        }
      }
    }
  }

  /// 取走冷启动期间缓存的结果（取一次即清空）
  func consumeBuffered(_ kind: WechatRespKind, _ completion: @escaping ([String: Any]?) -> Void) {
    onMain {
      guard let result = self.buffered.removeValue(forKey: kind) else {
        completion(nil)
        return
      }
      completion(Self.encode(kind, result))
    }
  }

  // MARK: - 生命周期兜底

  func handleWillResignActive() {
    onMain {
      if !self.pending.isEmpty {
        self.didLeaveApp = true
      }
    }
  }

  /// 用户在微信里按了 Home、或者直接杀掉微信而没点授权时，App 永远收不到 `onResp`。
  /// 不兜底的话槽会被永久占住，之后每次请求都直接 `ERR_WECHAT_PENDING`，只能重启 App。
  func handleDidBecomeActive() {
    onMain {
      guard self.didLeaveApp else { return }
      self.didLeaveApp = false

      // 正常回调（openURL / Universal Link）通常紧跟其后到达，先给它一点时间
      DispatchQueue.main.asyncAfter(deadline: .now() + self.resumeGraceInterval) {
        for kind in Array(self.pending.keys) {
          // 注意不是 ERR_WECHAT_USER_CANCELLED：用户主动取消的话微信会明确回 -2。
          // 走到这里说明压根没等到回调，可能是用户放弃了，
          // 也可能是 Universal Link 配置有问题导致回调丢失——大量出现时要往后者查。
          self.settle(
            kind,
            .failure(WechatError(code: "ERR_WECHAT_NO_RESPONSE", message: "从微信返回后没有等到结果"))
          )
        }
      }
    }
  }

  // MARK: - WXApiDelegate

  /// 微信主动发起的请求（分享回调进 App、小程序拉起等
  func onReq(_ req: BaseReq) {}

  func onResp(_ resp: BaseResp) {
    // 接新功能 = 在这里加一个 case，其余路由代码不动
    switch resp {
    case let resp as SendAuthResp:
      settle(WechatAuthRequest.kind, WechatAuthRequest.makeResult(from: resp))
    case let resp as SendMessageToWXResp:
      settle(WechatShareRequest.kind, WechatShareRequest.makeResult(from: resp))
    default:
      NSLog("[wechat] 收到未处理的响应类型：\(type(of: resp))")
    }
  }

  // MARK: - Private

  private func settle(_ kind: WechatRespKind, _ result: WechatResult) {
    onMain {
      // 事件是全量观察通道，成功失败都发；正常流程请用 Promise，两者会同时触发
      self.module?.sendEvent("onResponse", Self.encode(kind, result))

      guard let promise = self.pending.removeValue(forKey: kind) else {
        // 没人认领分两种情况，只有前一种该缓存：
        // 1. 冷启动——App 被杀后从微信返回，resp 早于 JS bundle 加载，JS 起来要主动取
        // 2. 超时结掉后迟到的回调——上层已经拿到 ERR_WECHAT_NO_RESPONSE 了，
        //    这里再缓存的话，下次 consume 会把它当成冷启动结果返回，变成「没分享却提示成功」
        if !self.claimed.contains(kind) {
          self.buffered[kind] = result
        }
        return
      }

      // 关键：不 reject。用户取消 / 拒绝是正常的流程分支，不是异常，
      // 而且 Expo 的 Promise.reject 会把 message 吞掉（只剩 "undefined reason"）。
      // 统一 resolve 成 WechatResult，调用方靠 result.ok 判别即可。
      promise.resolve(Self.encode(kind, result))
    }
  }

  /// 请求还没发出去就失败时走这里，保证 JS 侧拿到的形状和正常结果完全一致
  func fail(_ kind: WechatRespKind, _ code: String, _ message: String, _ promise: Promise) {
    promise.resolve(Self.encode(kind, .failure(WechatError(code: code, message: message))))
  }

  /// 安全地读 `WXCheckULStepResult` 的字符串字段。
  ///
  /// 这个类的属性声明在 `NS_ASSUME_NONNULL_BEGIN` 里且没标 `nullable`，Swift 侧因此是
  /// 非可选 `String`；但同一个类的 `initWithCheckResult:errorInfo:suggestion:` 收的是
  /// `nullable NSString*`（WXApiObject.h:120）——也就是说头文件在撒谎，运行时真的可能是 nil，
  /// 而直接读非可选 `String` 会在桥接时崩。走 KVC 把可选性拿回来。
  private static func ulText(_ result: WXCheckULStepResult, _ key: String) -> String {
    (result.value(forKey: key) as? String) ?? ""
  }

  private static func stepName(_ step: WXULCheckStep) -> String {
    switch step {
    case .params: return "params"
    case .systemVersion: return "systemVersion"
    case .wechatVersion: return "wechatVersion"
    case .sdkInnerOperation: return "sdkInnerOperation"
    case .launchWechat: return "launchWechat"
    case .backToCurrentApp: return "backToCurrentApp"
    case .final: return "final"
    @unknown default: return "unknown(\(step.rawValue))"
    }
  }

  /// 两个分支都带齐全部字段，缺的显式给 NSNull（对应 JS 的 null）。
  /// 不这么写的话，成功时 JS 侧拿到的 `code` 是 `undefined` 而不是 `null`，
  /// 直接解构和统一上报都会别扭。
  private static func encode(_ kind: WechatRespKind, _ result: WechatResult) -> [String: Any] {
    switch result {
    case .success(let payload):
      return [
        "kind": kind.rawValue,
        "ok": true,
        "payload": payload,
        "code": NSNull(),
        "message": NSNull()
      ]
    case .failure(let error):
      return [
        "kind": kind.rawValue,
        "ok": false,
        "payload": NSNull(),
        "code": error.code,
        "message": error.message
      ]
    }
  }

  /// 主线程独占状态，所以每个入口都过这一道
  private func onMain(_ work: @escaping () -> Void) {
    if Thread.isMainThread {
      work()
    } else {
      DispatchQueue.main.async(execute: work)
    }
  }

  private func registerIfNeeded() -> Bool {
    if isRegistered {
      return true
    }
    guard
      let appId = Bundle.main.object(forInfoDictionaryKey: "WXAppID") as? String, !appId.isEmpty,
      let universalLink = Bundle.main.object(forInfoDictionaryKey: "WXUniversalLink") as? String, !universalLink.isEmpty
    else {
      NSLog("[wechat] Info.plist 缺少 WXAppID / WXUniversalLink，跳过微信 SDK 注册")
      return false
    }

    self.appId = appId
    isRegistered = WXApi.registerApp(appId, universalLink: universalLink)
    if !isRegistered {
      NSLog("[wechat] WXApi.registerApp 失败，appId=\(appId)")
    }
    return isRegistered
  }
}
