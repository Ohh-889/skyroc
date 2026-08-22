import ExpoModulesCore
import WechatOpenSDK

/// 分享目标场景。小程序卡片只支持会话。
enum WechatShareScene: String, Enumerable {
  case session
  case timeline
  case favorite

  var rawScene: Int32 {
    switch self {
    case .session: return Int32(WXSceneSession.rawValue)
    case .timeline: return Int32(WXSceneTimeline.rawValue)
    case .favorite: return Int32(WXSceneFavorite.rawValue)
    }
  }
}

enum WechatMiniProgramType: String, Enumerable {
  case release
  case test
  case preview

  var rawType: WXMiniProgramType {
    switch self {
    case .release: return .release
    case .test: return .test
    case .preview: return .preview
    }
  }
}

// MARK: - 各类型的参数
//
// Record 要求有无参 init，所以字段一律带默认值；必填项在 WechatShareRequest 里校验，
// 这样报错信息能明确说是哪个字段，比 Expo 的通用转换失败可读。

struct ShareTextOptions: Record {
  @Field var scene: WechatShareScene = .session
  /** 长度必须大于 0 且小于 10K */
  @Field var text: String = ""
}

struct ShareImageOptions: Record {
  @Field var scene: WechatShareScene = .session
  /** 图片来源：http(s) / file:// / 绝对路径 / data: URI，上限 10MB */
  @Field var image: String = ""
  @Field var title: String?
  @Field var description: String?
  @Field var thumb: String?
}

struct ShareWebpageOptions: Record {
  @Field var scene: WechatShareScene = .session
  /** 网页地址，上限 10KB */
  @Field var url: String = ""
  @Field var title: String?
  @Field var description: String?
  @Field var thumb: String?
}

struct ShareVideoOptions: Record {
  @Field var scene: WechatShareScene = .session
  /** 视频链接，上限 10KB */
  @Field var url: String = ""
  /** 低带宽视频链接，上限 10KB */
  @Field var lowBandUrl: String?
  @Field var title: String?
  @Field var description: String?
  @Field var thumb: String?
}

struct ShareMusicOptions: Record {
  @Field var scene: WechatShareScene = .session
  /** 音乐网页地址，点开后跳转 */
  @Field var url: String = ""
  /** 音乐数据地址，微信直接播放 */
  @Field var dataUrl: String = ""
  @Field var lowBandUrl: String?
  @Field var lowBandDataUrl: String?
  @Field var songAlbumUrl: String?
  @Field var songLyric: String?
  @Field var title: String?
  @Field var description: String?
  @Field var thumb: String?
}

struct ShareMusicVideoOptions: Record {
  @Field var scene: WechatShareScene = .session
  @Field var musicUrl: String = ""
  @Field var musicDataUrl: String = ""
  /** 歌手名，必填，上限 1KB */
  @Field var singerName: String = ""
  /** 时长，单位毫秒 */
  @Field var duration: Int?
  /** 歌词，上限 32K */
  @Field var songLyric: String?
  /** 高清专辑封面，上限 1MB */
  @Field var hdAlbumThumb: String?
  @Field var albumName: String?
  @Field var musicGenre: String?
  /** 发行时间，Unix 时间戳（秒） */
  @Field var issueDate: Int?
  @Field var identification: String?
  @Field var musicOperationUrl: String?
  @Field var title: String?
  @Field var description: String?
  @Field var thumb: String?
}

struct ShareFileOptions: Record {
  @Field var scene: WechatShareScene = .session
  /** 文件来源，上限 10MB */
  @Field var file: String = ""
  /** 文件后缀名（含点，如 `.pdf`）；不传则从来源路径推断，上限 64 字节 */
  @Field var fileExtension: String?
  @Field var title: String?
  @Field var description: String?
  @Field var thumb: String?
}

struct ShareEmoticonOptions: Record {
  @Field var scene: WechatShareScene = .session
  /** 表情图片来源（gif / png），上限 10MB */
  @Field var emoticon: String = ""
  @Field var title: String?
  @Field var description: String?
  @Field var thumb: String?
}

struct ShareMiniProgramOptions: Record {
  /** 小程序卡片只支持会话，传别的会被强制改回 session */
  @Field var scene: WechatShareScene = .session
  /** 兼容低版本微信的网页地址，上限 10KB */
  @Field var webpageUrl: String = ""
  /** 小程序原始 ID，形如 gh_xxxxxxxx */
  @Field var userName: String = ""
  @Field var path: String?
  /** 卡片封面大图，上限 128KB；不传则退化成 thumb */
  @Field var hdImage: String?
  @Field var withShareTicket: Bool = false
  @Field var miniProgramType: WechatMiniProgramType = .release
  @Field var disableForward: Bool = false
  @Field var title: String?
  @Field var description: String?
  @Field var thumb: String?
}
