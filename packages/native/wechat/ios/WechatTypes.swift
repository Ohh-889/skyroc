import ExpoModulesCore
import WechatOpenSDK

/// 微信响应的种类。
///
/// 微信的 `onResp` 只有一个回调口子，且 resp 里带不回自己的请求 id
/// （只有 `SendAuthResp.state` 是例外），所以只能按 resp 子类型认领 Promise。
/// 微信交互本身是串行的，一种类型一个槽就够。
enum WechatRespKind: String {
  case auth
  case share
  // 接新功能时在这里加：case pay / launchMiniProgram
}

struct WechatError: Error {
  let code: String
  let message: String
}

extension String {
  /// 微信 SDK 的头文件整份包在 `NS_ASSUME_NONNULL_BEGIN` 里，`errStr` 这类字段在 Swift
  /// 侧是非可选 `String`，写 `?? "兜底"` 右边永远执行不到（编译器会报 warning）。
  /// 但微信失败时给的往往是空串而不是 nil，所以兜底要判空串。
  func orIfEmpty(_ fallback: @autoclosure () -> String) -> String {
    isEmpty ? fallback() : self
  }
}

/// 把微信的整数错误码翻成 JS 侧稳定的字符串错误码。
///
/// 错误码定义见 SDK 头文件 `WXApiObject.h` 的 `enum WXErrCode`：
/// ios/Pods/WechatOpenSDK-XCFramework/WechatOpenSDK.xcframework/ios-arm64/WechatOpenSDK.framework/Headers/WXApiObject.h:17
///
/// 这一层是所有功能共用的——分享、支付、小程序的「用户取消」同样是 -2，
/// 每个功能的 resp 解析只需要处理自己独有的字段。
enum WechatErrCode {
  static func commonError(from resp: BaseResp) -> WechatError? {
    switch resp.errCode {
    case Int32(WXSuccess.rawValue):
      return nil
    case Int32(WXErrCodeUserCancel.rawValue):
      return WechatError(code: "ERR_WECHAT_USER_CANCELLED", message: "用户取消了操作")
    case Int32(WXErrCodeAuthDeny.rawValue):
      return WechatError(code: "ERR_WECHAT_AUTH_DENIED", message: "用户拒绝了授权")
    case Int32(WXErrCodeUnsupport.rawValue):
      return WechatError(code: "ERR_WECHAT_UNSUPPORTED", message: "当前微信版本不支持该功能")
    case Int32(WXErrCodeSentFail.rawValue):
      return WechatError(code: "ERR_WECHAT_SENT_FAILED", message: resp.errStr.orIfEmpty("微信发送失败"))
    case Int32(WXErrCodeCommon.rawValue):
      return WechatError(code: "ERR_WECHAT_COMMON", message: resp.errStr.orIfEmpty("微信返回普通错误"))
    default:
      // 微信后续新增的错误码会走到这里
      return WechatError(
        code: "ERR_WECHAT_FAILED",
        message: resp.errStr.orIfEmpty("微信返回失败(\(resp.errCode))")
      )
    }
  }
}
