import WechatOpenSDK

/// 分享与收藏：构造各类型的 `SendMessageToWXReq` + 把 resp 翻成 payload。
///
/// 所有 `make*Request` 都是 async，因为缩略图和媒体数据可能要从网络下载。
enum WechatShareRequest {
  static let kind = WechatRespKind.share

  // 微信侧的字节上限，见 WXApiObject.h 各 @note 与开放平台文档
  private enum Limit {
    static let title = 512
    static let description = 1024
    static let text = 10 * 1024
    static let url = 10 * 1024
    static let imageData = 10 * 1024 * 1024
    static let fileData = 10 * 1024 * 1024
    static let emoticonData = 10 * 1024 * 1024
    static let hdImageData = 128 * 1024
    static let hdAlbumThumbData = 1024 * 1024
    static let songLyric = 32 * 1024
    static let singerName = 1024
    static let fileExtension = 64
  }

  // MARK: - 文本

  static func makeRequest(_ options: ShareTextOptions) throws -> SendMessageToWXReq {
    let text = try require(options.text, field: "text")
    guard text.utf8.count < Limit.text else {
      throw WechatError(code: "ERR_WECHAT_INVALID_OPTIONS", message: "text 超过 10K")
    }

    let req = SendMessageToWXReq()
    req.bText = true
    req.text = text
    req.scene = options.scene.rawScene
    return req
  }

  // MARK: - 图片

  static func makeRequest(_ options: ShareImageOptions) async throws -> SendMessageToWXReq {
    let source = try require(options.image, field: "image")
    // 原图和缩略图并行下载
    async let thumbData = WechatMediaLoader.loadThumbData(from: options.thumb)
    async let imageData = WechatMediaLoader.loadData(
      from: source,
      maxBytes: Limit.imageData,
      label: "图片"
    )

    let object = WXImageObject()
    object.imageData = try await imageData

    return makeMediaRequest(
      object,
      scene: options.scene,
      title: options.title,
      description: options.description,
      thumbData: try await thumbData
    )
  }

  // MARK: - 网页

  static func makeRequest(_ options: ShareWebpageOptions) async throws -> SendMessageToWXReq {
    let object = WXWebpageObject()
    object.webpageUrl = try requireUrl(options.url, field: "url")

    return makeMediaRequest(
      object,
      scene: options.scene,
      title: options.title,
      description: options.description,
      thumbData: try await WechatMediaLoader.loadThumbData(from: options.thumb)
    )
  }

  // MARK: - 视频

  static func makeRequest(_ options: ShareVideoOptions) async throws -> SendMessageToWXReq {
    let object = WXVideoObject()
    object.videoUrl = try requireUrl(options.url, field: "url")
    if let lowBandUrl = options.lowBandUrl {
      object.videoLowBandUrl = lowBandUrl
    }

    return makeMediaRequest(
      object,
      scene: options.scene,
      title: options.title,
      description: options.description,
      thumbData: try await WechatMediaLoader.loadThumbData(from: options.thumb)
    )
  }

  // MARK: - 音乐

  static func makeRequest(_ options: ShareMusicOptions) async throws -> SendMessageToWXReq {
    let object = WXMusicObject()
    object.musicUrl = try requireUrl(options.url, field: "url")
    object.musicDataUrl = try requireUrl(options.dataUrl, field: "dataUrl")
    if let lowBandUrl = options.lowBandUrl {
      object.musicLowBandUrl = lowBandUrl
    }
    if let lowBandDataUrl = options.lowBandDataUrl {
      object.musicLowBandDataUrl = lowBandDataUrl
    }
    if let songAlbumUrl = options.songAlbumUrl {
      object.songAlbumUrl = songAlbumUrl
    }
    object.songLyric = options.songLyric?.truncated(utf8Bytes: Limit.songLyric)

    return makeMediaRequest(
      object,
      scene: options.scene,
      title: options.title,
      description: options.description,
      thumbData: try await WechatMediaLoader.loadThumbData(from: options.thumb)
    )
  }

  // MARK: - 音乐视频

  static func makeRequest(_ options: ShareMusicVideoOptions) async throws -> SendMessageToWXReq {
    let object = WXMusicVideoObject()
    object.musicUrl = try requireUrl(options.musicUrl, field: "musicUrl")
    object.musicDataUrl = try requireUrl(options.musicDataUrl, field: "musicDataUrl")
    object.singerName = try require(options.singerName, field: "singerName")
      .truncated(utf8Bytes: Limit.singerName)
    object.duration = UInt32(max(0, options.duration ?? 0))
    object.songLyric = options.songLyric?.truncated(utf8Bytes: Limit.songLyric) ?? ""
    object.albumName = options.albumName
    object.musicGenre = options.musicGenre
    object.issueDate = UInt64(max(0, options.issueDate ?? 0))
    object.identification = options.identification
    object.musicOperationUrl = options.musicOperationUrl

    // 高清封面和缩略图并行下载
    async let thumbData = WechatMediaLoader.loadThumbData(from: options.thumb)
    if let hdAlbumThumb = options.hdAlbumThumb {
      object.hdAlbumThumbData = try await WechatMediaLoader.loadData(
        from: hdAlbumThumb,
        maxBytes: Limit.hdAlbumThumbData,
        label: "高清专辑封面"
      )
    }

    return makeMediaRequest(
      object,
      scene: options.scene,
      title: options.title,
      description: options.description,
      thumbData: try await thumbData
    )
  }

  // MARK: - 文件

  static func makeRequest(_ options: ShareFileOptions) async throws -> SendMessageToWXReq {
    let source = try require(options.file, field: "file")

    async let thumbData = WechatMediaLoader.loadThumbData(from: options.thumb)

    let object = WXFileObject()
    object.fileData = try await WechatMediaLoader.loadData(
      from: source,
      maxBytes: Limit.fileData,
      label: "文件"
    )
    // 微信靠后缀名决定文件图标和能否预览，不传就从来源路径推
    let inferred = options.fileExtension ?? inferExtension(from: source)
    guard !inferred.isEmpty else {
      throw WechatError(
        code: "ERR_WECHAT_INVALID_OPTIONS",
        message: "无法从 file 推断后缀名，请显式传 fileExtension（形如 \".pdf\"）"
      )
    }
    object.fileExtension = inferred.truncated(utf8Bytes: Limit.fileExtension)

    return makeMediaRequest(
      object,
      scene: options.scene,
      title: options.title,
      description: options.description,
      thumbData: try await thumbData
    )
  }

  // MARK: - 表情

  static func makeRequest(_ options: ShareEmoticonOptions) async throws -> SendMessageToWXReq {
    let source = try require(options.emoticon, field: "emoticon")
    async let thumbData = WechatMediaLoader.loadThumbData(from: options.thumb)

    let object = WXEmoticonObject()
    object.emoticonData = try await WechatMediaLoader.loadData(
      from: source,
      maxBytes: Limit.emoticonData,
      label: "表情"
    )

    return makeMediaRequest(
      object,
      scene: options.scene,
      title: options.title,
      description: options.description,
      thumbData: try await thumbData
    )
  }

  // MARK: - 小程序

  static func makeRequest(_ options: ShareMiniProgramOptions) async throws -> SendMessageToWXReq {
    let object = WXMiniProgramObject()
    object.webpageUrl = try requireUrl(options.webpageUrl, field: "webpageUrl")
    object.userName = try require(options.userName, field: "userName")
    object.path = options.path
    object.withShareTicket = options.withShareTicket
    object.miniProgramType = options.miniProgramType.rawType
    object.disableForward = options.disableForward

    async let thumbData = WechatMediaLoader.loadThumbData(from: options.thumb)
    if let hdImage = options.hdImage {
      object.hdImageData = try await WechatMediaLoader.loadData(
        from: hdImage,
        maxBytes: Limit.hdImageData,
        label: "小程序封面"
      )
    }

    // 小程序卡片只能发到会话，微信侧发到别的场景会直接失败
    return makeMediaRequest(
      object,
      scene: .session,
      title: options.title,
      description: options.description,
      thumbData: try await thumbData
    )
  }

  // MARK: - 响应

  static func makeResult(from resp: SendMessageToWXResp) -> WechatResult {
    if let error = WechatErrCode.commonError(from: resp) {
      return .failure(error)
    }
    // 注意和 `WechatAuthRequest` 不一样：`SendAuthResp` 的 lang/country 在头文件里标了
    // `nullable`，这里 `SendMessageToWXResp` 的没标，Swift 侧是非可选 String——
    // 所以不需要（也不能）用 `?? NSNull()` 兜。JS 侧这两个字段拿到的是字符串，不会是 null。
    return .success([
      "errCode": Int(resp.errCode),
      "errStr": resp.errStr,
      "lang": resp.lang,
      "country": resp.country
    ])
  }

  // MARK: - Private

  /// 除文本外所有类型共用：套上 WXMediaMessage，处理标题/描述截断。
  ///
  /// 缩略图由各 `makeRequest` 用 `async let` 先起下载、最后再 await，
  /// 这样主媒体和缩略图是并行的；放在这里 await 就变成串行两次 RTT 了。
  private static func makeMediaRequest(
    _ mediaObject: Any,
    scene: WechatShareScene,
    title: String?,
    description: String?,
    thumbData: Data?
  ) -> SendMessageToWXReq {
    let message = WXMediaMessage()
    message.mediaObject = mediaObject
    message.title = title?.truncated(utf8Bytes: Limit.title) ?? ""
    message.description = description?.truncated(utf8Bytes: Limit.description) ?? ""
    message.thumbData = thumbData

    let req = SendMessageToWXReq()
    req.bText = false
    req.message = message
    req.scene = scene.rawScene
    return req
  }

  private static func require(_ value: String, field: String) throws -> String {
    guard !value.isEmpty else {
      throw WechatError(code: "ERR_WECHAT_INVALID_OPTIONS", message: "缺少必填字段 \(field)")
    }
    return value
  }

  private static func requireUrl(_ value: String, field: String) throws -> String {
    let url = try require(value, field: field)
    guard url.utf8.count <= Limit.url else {
      throw WechatError(code: "ERR_WECHAT_INVALID_OPTIONS", message: "\(field) 超过 10K")
    }
    return url
  }

  private static func inferExtension(from source: String) -> String {
    let path = source.hasPrefix("http") ? (URL(string: source)?.path ?? source) : source
    let ext = (path as NSString).pathExtension
    return ext.isEmpty ? "" : ".\(ext)"
  }
}
