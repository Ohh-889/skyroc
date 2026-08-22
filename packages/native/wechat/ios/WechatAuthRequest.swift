import WechatOpenSDK

/// 微信登录授权：构造 req + 把 resp 翻成 JS 侧的 payload。
///
/// 每个微信功能都是这样一个独立文件，`WechatSDK` 只负责路由，不认识具体业务。
enum WechatAuthRequest {
  static let kind = WechatRespKind.auth

  static func makeRequest(scope: String, state: String?) -> SendAuthReq {
    let req = SendAuthReq()
    req.scope = scope
    req.state = state ?? ""
    return req
  }

  static func makeResult(from resp: SendAuthResp) -> WechatResult {
    if let error = WechatErrCode.commonError(from: resp) {
      return .failure(error)
    }

    var payload: [String: Any] = [
      "errCode": Int(resp.errCode),
      "errStr": resp.errStr
    ]
    // 字典下标赋 nil 会把 key 删掉，JS 侧就成了 undefined；显式写 NSNull 才是 null
    payload["code"] = resp.code ?? NSNull()
    payload["state"] = resp.state ?? NSNull()
    payload["lang"] = resp.lang ?? NSNull()
    payload["country"] = resp.country ?? NSNull()

    return .success(payload)
  }
}
