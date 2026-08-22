import ExpoModulesCore
import WechatOpenSDK

/// 把一次分享跑完：异步准备请求（可能要下载图片）→ 交给 WechatSDK 发出去。
///
/// 准备阶段的失败（缺字段、下载失败、超限）也走统一的 WechatResult 格式返回，
/// 不 reject、也不会占住 `pending` 槽，调用方可以直接重试。
private func runShare(_ promise: Promise, _ makeRequest: @escaping () async throws -> SendMessageToWXReq) {
  Task {
    do {
      let req = try await makeRequest()
      WechatSDK.shared.send(req, kind: WechatShareRequest.kind, promise: promise)
    } catch let error as WechatError {
      WechatSDK.shared.fail(WechatShareRequest.kind, error.code, error.message, promise)
    } catch {
      WechatSDK.shared.fail(
        WechatShareRequest.kind,
        "ERR_WECHAT_SHARE_PREPARE_FAILED",
        error.localizedDescription,
        promise
      )
    }
  }
}

public class WechatModule: Module {
  public func definition() -> ModuleDefinition {
    Name("Wechat")

    // onRequestSent 是第一段（已唤起微信），onResponse 是第二段（微信真正的结果）
    Events("onRequestSent", "onResponse")

    OnCreate {
      WechatSDK.shared.attach(module: self)
      WechatSDK.shared.register()
    }

    OnDestroy {
      WechatSDK.shared.detach()
    }

    // 所有方法都不需要 .runOnQueue(.main)：WechatSDK 内部自己切主线程，
    // 正确性不依赖「新加方法的人记得标队列」这种隐式约定
    AsyncFunction("isWechatInstalledAsync") { (promise: Promise) in
      WechatSDK.shared.checkInstalled { promise.resolve($0) }
    }

    AsyncFunction("openWechatAsync") { (promise: Promise) in
      WechatSDK.shared.openWechat { promise.resolve($0) }
    }

    AsyncFunction("getApiVersionAsync") { (promise: Promise) in
      WechatSDK.shared.apiVersion { promise.resolve($0) }
    }

    AsyncFunction("getInstallUrlAsync") { (promise: Promise) in
      WechatSDK.shared.installUrl { promise.resolve($0) }
    }

    /// Universal Link 自检，仅调试用；会把微信拉起来再跳回来
    AsyncFunction("checkUniversalLinkAsync") { (promise: Promise) in
      WechatSDK.shared.checkUniversalLink { promise.resolve($0) }
    }

    /// 调整「从微信返回后等多久判定没有结果」，返回钳制后实际生效的毫秒数
    AsyncFunction("setResumeGraceMsAsync") { (milliseconds: Double, promise: Promise) in
      WechatSDK.shared.setResumeGrace(seconds: milliseconds / 1000) { promise.resolve($0 * 1000) }
    }

    // MARK: 登录授权

    AsyncFunction("sendAuthAsync") { (scope: String, state: String?, promise: Promise) in
      WechatSDK.shared.send(
        WechatAuthRequest.makeRequest(scope: scope, state: state),
        kind: WechatAuthRequest.kind,
        promise: promise
      )
    }

    AsyncFunction("consumePendingAuthResponseAsync") { (promise: Promise) in
      WechatSDK.shared.consumeBuffered(WechatAuthRequest.kind) { promise.resolve($0) }
    }

    // MARK: 分享与收藏

    AsyncFunction("shareTextAsync") { (options: ShareTextOptions, promise: Promise) in
      runShare(promise) { try WechatShareRequest.makeRequest(options) }
    }

    AsyncFunction("shareImageAsync") { (options: ShareImageOptions, promise: Promise) in
      runShare(promise) { try await WechatShareRequest.makeRequest(options) }
    }

    AsyncFunction("shareWebpageAsync") { (options: ShareWebpageOptions, promise: Promise) in
      runShare(promise) { try await WechatShareRequest.makeRequest(options) }
    }

    AsyncFunction("shareVideoAsync") { (options: ShareVideoOptions, promise: Promise) in
      runShare(promise) { try await WechatShareRequest.makeRequest(options) }
    }

    AsyncFunction("shareMusicAsync") { (options: ShareMusicOptions, promise: Promise) in
      runShare(promise) { try await WechatShareRequest.makeRequest(options) }
    }

    AsyncFunction("shareMusicVideoAsync") { (options: ShareMusicVideoOptions, promise: Promise) in
      runShare(promise) { try await WechatShareRequest.makeRequest(options) }
    }

    AsyncFunction("shareFileAsync") { (options: ShareFileOptions, promise: Promise) in
      runShare(promise) { try await WechatShareRequest.makeRequest(options) }
    }

    AsyncFunction("shareEmoticonAsync") { (options: ShareEmoticonOptions, promise: Promise) in
      runShare(promise) { try await WechatShareRequest.makeRequest(options) }
    }

    AsyncFunction("shareMiniProgramAsync") { (options: ShareMiniProgramOptions, promise: Promise) in
      runShare(promise) { try await WechatShareRequest.makeRequest(options) }
    }

    AsyncFunction("consumePendingShareResponseAsync") { (promise: Promise) in
      WechatSDK.shared.consumeBuffered(WechatShareRequest.kind) { promise.resolve($0) }
    }
  }
}
