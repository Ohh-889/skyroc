package expo.modules.wechat

import com.tencent.mm.opensdk.modelbase.BaseResp

/**
 * 微信响应的种类。
 *
 * 和 iOS 一致：微信的回调只有一个口子，响应里带不回自己的请求 id，
 * 只能按响应子类型认领 Promise。微信交互本身是串行的，一种类型一个槽就够。
 */
enum class WechatRespKind(val value: String) {
  AUTH("auth"),
  SHARE("share")
  // 接新功能时在这里加：PAY("pay") / LAUNCH_MINI_PROGRAM("launchMiniProgram")
}

class WechatError(val code: String, override val message: String) : Exception(message)

/**
 * 把微信的整数错误码翻成 JS 侧稳定的字符串错误码。
 *
 * 错误码定义见 `BaseResp.ErrCode`。注意 Android 比 iOS 多一个 `ERR_BAN`
 * （iOS 的 `WXErrCode` 里没有这个值）。
 */
object WechatErrCode {
  fun commonError(resp: BaseResp): WechatError? = when (resp.errCode) {
    BaseResp.ErrCode.ERR_OK -> null
    BaseResp.ErrCode.ERR_USER_CANCEL ->
      WechatError("ERR_WECHAT_USER_CANCELLED", "用户取消了操作")
    BaseResp.ErrCode.ERR_AUTH_DENIED ->
      WechatError("ERR_WECHAT_AUTH_DENIED", "用户拒绝了授权")
    BaseResp.ErrCode.ERR_UNSUPPORT ->
      WechatError("ERR_WECHAT_UNSUPPORTED", "当前微信版本不支持该功能")
    BaseResp.ErrCode.ERR_SENT_FAILED ->
      WechatError("ERR_WECHAT_SENT_FAILED", resp.errStr ?: "微信发送失败")
    BaseResp.ErrCode.ERR_COMM ->
      WechatError("ERR_WECHAT_COMMON", resp.errStr ?: "微信返回普通错误")
    BaseResp.ErrCode.ERR_BAN ->
      WechatError("ERR_WECHAT_BANNED", resp.errStr ?: "应用被微信限制，请到开放平台确认应用状态")
    else ->
      WechatError("ERR_WECHAT_FAILED", resp.errStr ?: "微信返回失败(${resp.errCode})")
  }
}
