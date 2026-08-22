package expo.modules.wechat

import android.content.Context
import android.os.Bundle
import com.tencent.mm.opensdk.modelmsg.SendMessageToWX
import com.tencent.mm.opensdk.modelmsg.WXEmojiObject
import com.tencent.mm.opensdk.modelmsg.WXFileObject
import com.tencent.mm.opensdk.modelmsg.WXImageObject
import com.tencent.mm.opensdk.modelmsg.WXMediaMessage
import com.tencent.mm.opensdk.modelmsg.WXMiniProgramObject
import com.tencent.mm.opensdk.modelmsg.WXMusicObject
import com.tencent.mm.opensdk.modelmsg.WXMusicVideoObject
import com.tencent.mm.opensdk.modelmsg.WXTextObject
import com.tencent.mm.opensdk.modelmsg.WXVideoObject
import com.tencent.mm.opensdk.modelmsg.WXWebpageObject
import java.net.URL

/**
 * 分享与收藏：构造各类型的 `SendMessageToWX.Req` + 把 resp 翻成 payload。
 *
 * 所有 `makeRequest` 都是阻塞的（可能要下载媒体），必须在后台线程调用；
 * 调度由 `WechatModule.runShare` 负责。
 */
object WechatShareRequest {
  val kind = WechatRespKind.SHARE

  // 微信侧的字节上限，和 iOS 保持一致
  private object Limit {
    const val TITLE = WXMediaMessage.TITLE_LENGTH_LIMIT
    const val DESCRIPTION = WXMediaMessage.DESCRIPTION_LENGTH_LIMIT
    const val TEXT = 10 * 1024
    const val URL = 10 * 1024
    const val IMAGE_DATA = 10 * 1024 * 1024
    const val FILE_DATA = 10 * 1024 * 1024
    const val EMOTICON_DATA = 10 * 1024 * 1024
    const val HD_ALBUM_THUMB_DATA = 1024 * 1024
    const val SONG_LYRIC = 32 * 1024
    const val SINGER_NAME = 1024
    const val FILE_EXTENSION = 64
    /** 小程序卡片的封面走 thumbData，配额比普通缩略图大 */
    const val MINI_PROGRAM_THUMB = WXMediaMessage.MINI_PROGRAM__THUMB_LENGHT
  }

  // ---------------------------------------------------------------- 文本

  fun makeRequest(options: ShareTextOptions): SendMessageToWX.Req {
    val text = require(options.text, "text")
    if (text.toByteArray(Charsets.UTF_8).size >= Limit.TEXT) {
      throw WechatError("ERR_WECHAT_INVALID_OPTIONS", "text 超过 10K")
    }

    // Android 没有 iOS 的 bText 开关，纯文本也要包成 WXMediaMessage
    val message = WXMediaMessage().apply {
      mediaObject = WXTextObject(text)
      description = text
    }
    return makeReq(message, options.scene)
  }

  // ---------------------------------------------------------------- 图片

  fun makeRequest(options: ShareImageOptions): SendMessageToWX.Req {
    val source = require(options.image, "image")
    // 原图和缩略图并行下载
    val thumb = WechatMediaLoader.async { WechatMediaLoader.loadThumbData(options.thumb) }
    val imageData = WechatMediaLoader.loadData(source, Limit.IMAGE_DATA, "图片")

    val message = mediaMessage(options.title, options.description, thumb.get())
    message.mediaObject = WXImageObject().apply { this.imageData = imageData }
    return makeReq(message, options.scene)
  }

  // ---------------------------------------------------------------- 网页

  fun makeRequest(options: ShareWebpageOptions): SendMessageToWX.Req {
    val webpage = requireUrl(options.url, "url")

    val message = mediaMessage(options.title, options.description, WechatMediaLoader.loadThumbData(options.thumb))
    message.mediaObject = WXWebpageObject().apply { webpageUrl = webpage }
    return makeReq(message, options.scene)
  }

  // ---------------------------------------------------------------- 视频

  fun makeRequest(options: ShareVideoOptions): SendMessageToWX.Req {
    val video = requireUrl(options.url, "url")

    val message = mediaMessage(options.title, options.description, WechatMediaLoader.loadThumbData(options.thumb))
    message.mediaObject = WXVideoObject().apply {
      videoUrl = video
      options.lowBandUrl?.let { videoLowBandUrl = it }
    }
    return makeReq(message, options.scene)
  }

  // ---------------------------------------------------------------- 音乐

  fun makeRequest(options: ShareMusicOptions): SendMessageToWX.Req {
    val music = requireUrl(options.url, "url")
    val data = requireUrl(options.dataUrl, "dataUrl")

    val message = mediaMessage(options.title, options.description, WechatMediaLoader.loadThumbData(options.thumb))
    message.mediaObject = WXMusicObject().apply {
      musicUrl = music
      musicDataUrl = data
      options.lowBandUrl?.let { musicLowBandUrl = it }
      options.lowBandDataUrl?.let { musicLowBandDataUrl = it }
      options.songAlbumUrl?.let { songAlbumUrl = it }
      songLyric = options.songLyric?.truncatedUtf8(Limit.SONG_LYRIC)
    }
    return makeReq(message, options.scene)
  }

  // ------------------------------------------------------------ 音乐视频

  fun makeRequest(context: Context, options: ShareMusicVideoOptions): SendMessageToWX.Req {
    val music = requireUrl(options.musicUrl, "musicUrl")
    val data = requireUrl(options.musicDataUrl, "musicDataUrl")
    val singer = require(options.singerName, "singerName").truncatedUtf8(Limit.SINGER_NAME)

    // 高清封面和缩略图并行准备
    val thumb = WechatMediaLoader.async { WechatMediaLoader.loadThumbData(options.thumb) }
    // Android 的 hdAlbumThumbFilePath 只收路径不收字节数组，所以要先落盘
    val hdPath = options.hdAlbumThumb?.let {
      WechatMediaLoader.loadToCacheFile(context, it, Limit.HD_ALBUM_THUMB_DATA, "高清专辑封面")
    }

    val message = mediaMessage(options.title, options.description, thumb.get())
    message.mediaObject = WXMusicVideoObject().apply {
      musicUrl = music
      musicDataUrl = data
      singerName = singer
      duration = options.duration?.coerceAtLeast(0) ?: 0
      songLyric = options.songLyric?.truncatedUtf8(Limit.SONG_LYRIC)
      hdPath?.let { hdAlbumThumbFilePath = it }
      albumName = options.albumName
      musicGenre = options.musicGenre
      issueDate = options.issueDate?.coerceAtLeast(0L) ?: 0L
      identification = options.identification
      musicOperationUrl = options.musicOperationUrl
    }
    return makeReq(message, options.scene)
  }

  // ---------------------------------------------------------------- 文件

  fun makeRequest(options: ShareFileOptions): SendMessageToWX.Req {
    val source = require(options.file, "file")
    val thumb = WechatMediaLoader.async { WechatMediaLoader.loadThumbData(options.thumb) }
    val data = WechatMediaLoader.loadData(source, Limit.FILE_DATA, "文件")

    // 微信靠后缀名决定文件图标和能否预览，不传就从来源路径推
    val extension = (options.fileExtension ?: inferExtension(source)).ifEmpty {
      throw WechatError(
        "ERR_WECHAT_INVALID_OPTIONS",
        "无法从 file 推断后缀名，请显式传 fileExtension（形如 \".pdf\"）"
      )
    }

    val message = mediaMessage(options.title, options.description, thumb.get())
    message.mediaObject = WXFileObject().apply { fileData = data }
    // Android 靠 message.title 里的文件名后缀决定图标和能否预览（iOS 是 fileExtension 字段）
    val suffix = extension.truncatedUtf8(Limit.FILE_EXTENSION)
    val baseName = message.title.ifEmpty { "file" }
    message.title = if (baseName.endsWith(suffix, ignoreCase = true)) baseName else "$baseName$suffix"
    return makeReq(message, options.scene)
  }

  // ---------------------------------------------------------------- 表情

  fun makeRequest(options: ShareEmoticonOptions): SendMessageToWX.Req {
    val source = require(options.emoticon, "emoticon")
    val thumb = WechatMediaLoader.async { WechatMediaLoader.loadThumbData(options.thumb) }
    val data = WechatMediaLoader.loadData(source, Limit.EMOTICON_DATA, "表情")

    val message = mediaMessage(options.title, options.description, thumb.get())
    message.mediaObject = WXEmojiObject().apply { emojiData = data }
    return makeReq(message, options.scene)
  }

  // ---------------------------------------------------------------- 小程序

  fun makeRequest(options: ShareMiniProgramOptions): SendMessageToWX.Req {
    val fallback = requireUrl(options.webpageUrl, "webpageUrl")
    val user = require(options.userName, "userName")

    // Android 的 WXMiniProgramObject 没有 hdImageData 字段，
    // 封面大图统一走 thumbData，只是配额比普通缩略图大（128KB）
    val thumbSource = options.hdImage ?: options.thumb
    val thumbData = WechatMediaLoader.loadThumbData(thumbSource, Limit.MINI_PROGRAM_THUMB)

    val message = mediaMessage(options.title, options.description, thumbData)
    message.mediaObject = WXMiniProgramObject().apply {
      webpageUrl = fallback
      userName = user
      path = options.path
      withShareTicket = options.withShareTicket
      miniprogramType = options.miniProgramType.rawType
      disableforward = if (options.disableForward) 1 else 0
    }
    // 小程序卡片只能发到会话，微信侧发到别的场景会直接失败
    return makeReq(message, WechatShareScene.SESSION)
  }

  // ---------------------------------------------------------------- 响应

  fun makeResult(resp: SendMessageToWX.Resp): Result<Bundle> {
    WechatErrCode.commonError(resp)?.let { return Result.failure(it) }

    // Android 的 SendMessageToWX.Resp 没有 lang / country（iOS 有），补 null 保持结构一致
    return Result.success(
      Bundle().apply {
        putInt("errCode", resp.errCode)
        putString("errStr", resp.errStr.orEmpty())
        putString("lang", null)
        putString("country", null)
      }
    )
  }

  // ---------------------------------------------------------------- private

  private fun mediaMessage(title: String?, description: String?, thumbData: ByteArray?) =
    WXMediaMessage().apply {
      this.title = title?.truncatedUtf8(Limit.TITLE).orEmpty()
      this.description = description?.truncatedUtf8(Limit.DESCRIPTION).orEmpty()
      this.thumbData = thumbData
    }

  private fun makeReq(message: WXMediaMessage, scene: WechatShareScene) = SendMessageToWX.Req().apply {
    // transaction 是 Android 独有的请求标识，微信会原样回传，方便对着日志排查
    transaction = "wechat_share_${System.currentTimeMillis()}"
    this.message = message
    this.scene = scene.rawScene
  }

  private fun require(value: String, field: String): String {
    if (value.isEmpty()) {
      throw WechatError("ERR_WECHAT_INVALID_OPTIONS", "缺少必填字段 $field")
    }
    return value
  }

  private fun requireUrl(value: String, field: String): String {
    val url = require(value, field)
    if (url.toByteArray(Charsets.UTF_8).size > Limit.URL) {
      throw WechatError("ERR_WECHAT_INVALID_OPTIONS", "$field 超过 10K")
    }
    return url
  }

  private fun inferExtension(source: String): String {
    val path = if (source.startsWith("http")) {
      runCatching { URL(source).path }.getOrDefault(source)
    } else {
      source
    }
    val extension = path.substringAfterLast('.', "")
    return if (extension.isEmpty()) "" else ".$extension"
  }
}
