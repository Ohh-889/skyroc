package expo.modules.wechat

import com.tencent.mm.opensdk.modelmsg.SendMessageToWX
import com.tencent.mm.opensdk.modelmsg.WXMiniProgramObject
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record
import expo.modules.kotlin.types.Enumerable

/** 分享目标场景。小程序卡片只支持会话。 */
enum class WechatShareScene(val value: String) : Enumerable {
  SESSION("session"),
  TIMELINE("timeline"),
  FAVORITE("favorite");

  val rawScene: Int
    get() = when (this) {
      SESSION -> SendMessageToWX.Req.WXSceneSession
      TIMELINE -> SendMessageToWX.Req.WXSceneTimeline
      FAVORITE -> SendMessageToWX.Req.WXSceneFavorite
    }
}

enum class WechatMiniProgramType(val value: String) : Enumerable {
  RELEASE("release"),
  TEST("test"),
  PREVIEW("preview");

  val rawType: Int
    get() = when (this) {
      RELEASE -> WXMiniProgramObject.MINIPTOGRAM_TYPE_RELEASE
      TEST -> WXMiniProgramObject.MINIPROGRAM_TYPE_TEST
      PREVIEW -> WXMiniProgramObject.MINIPROGRAM_TYPE_PREVIEW
    }
}

// Record 要求无参构造，所以字段一律带默认值；必填项在 WechatShareRequest 里校验，
// 这样报错能明确说是哪个字段，比 Expo 的通用转换失败可读。

class ShareTextOptions : Record {
  @Field var scene: WechatShareScene = WechatShareScene.SESSION
  @Field var text: String = ""
}

class ShareImageOptions : Record {
  @Field var scene: WechatShareScene = WechatShareScene.SESSION
  @Field var image: String = ""
  @Field var title: String? = null
  @Field var description: String? = null
  @Field var thumb: String? = null
}

class ShareWebpageOptions : Record {
  @Field var scene: WechatShareScene = WechatShareScene.SESSION
  @Field var url: String = ""
  @Field var title: String? = null
  @Field var description: String? = null
  @Field var thumb: String? = null
}

class ShareVideoOptions : Record {
  @Field var scene: WechatShareScene = WechatShareScene.SESSION
  @Field var url: String = ""
  @Field var lowBandUrl: String? = null
  @Field var title: String? = null
  @Field var description: String? = null
  @Field var thumb: String? = null
}

class ShareMusicOptions : Record {
  @Field var scene: WechatShareScene = WechatShareScene.SESSION
  @Field var url: String = ""
  @Field var dataUrl: String = ""
  @Field var lowBandUrl: String? = null
  @Field var lowBandDataUrl: String? = null
  @Field var songAlbumUrl: String? = null
  @Field var songLyric: String? = null
  @Field var title: String? = null
  @Field var description: String? = null
  @Field var thumb: String? = null
}

class ShareMusicVideoOptions : Record {
  @Field var scene: WechatShareScene = WechatShareScene.SESSION
  @Field var musicUrl: String = ""
  @Field var musicDataUrl: String = ""
  @Field var singerName: String = ""
  @Field var duration: Int? = null
  @Field var songLyric: String? = null
  @Field var hdAlbumThumb: String? = null
  @Field var albumName: String? = null
  @Field var musicGenre: String? = null
  @Field var issueDate: Long? = null
  @Field var identification: String? = null
  @Field var musicOperationUrl: String? = null
  @Field var title: String? = null
  @Field var description: String? = null
  @Field var thumb: String? = null
}

class ShareFileOptions : Record {
  @Field var scene: WechatShareScene = WechatShareScene.SESSION
  @Field var file: String = ""
  @Field var fileExtension: String? = null
  @Field var title: String? = null
  @Field var description: String? = null
  @Field var thumb: String? = null
}

class ShareEmoticonOptions : Record {
  @Field var scene: WechatShareScene = WechatShareScene.SESSION
  @Field var emoticon: String = ""
  @Field var title: String? = null
  @Field var description: String? = null
  @Field var thumb: String? = null
}

class ShareMiniProgramOptions : Record {
  @Field var scene: WechatShareScene = WechatShareScene.SESSION
  @Field var webpageUrl: String = ""
  @Field var userName: String = ""
  @Field var path: String? = null
  @Field var hdImage: String? = null
  @Field var withShareTicket: Boolean = false
  @Field var miniProgramType: WechatMiniProgramType = WechatMiniProgramType.RELEASE
  @Field var disableForward: Boolean = false
  @Field var title: String? = null
  @Field var description: String? = null
  @Field var thumb: String? = null
}
