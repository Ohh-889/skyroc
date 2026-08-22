package expo.modules.wechat

import android.os.Bundle
import com.tencent.mm.opensdk.modelmsg.SendAuth

/**
 * 微信登录授权：构造 req + 把 resp 翻成 JS 侧的 payload。
 *
 * 每个微信功能都是这样一个独立文件，`WechatSDK` 只负责路由，不认识具体业务。
 */
object WechatAuthRequest {
  val kind = WechatRespKind.AUTH

  fun makeRequest(scope: String, state: String?): SendAuth.Req = SendAuth.Req().apply {
    this.scope = scope
    this.state = state.orEmpty()
  }

  fun makeResult(resp: SendAuth.Resp): Result<Bundle> {
    WechatErrCode.commonError(resp)?.let { return Result.failure(it) }

    return Result.success(
      Bundle().apply {
        putInt("errCode", resp.errCode)
        putString("errStr", resp.errStr.orEmpty())
        putString("code", resp.code)
        putString("state", resp.state)
        putString("lang", resp.lang)
        putString("country", resp.country)
      }
    )
  }
}
