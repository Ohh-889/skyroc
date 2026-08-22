package expo.modules.wechat

import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.util.Base64
import android.util.LruCache
import java.io.ByteArrayOutputStream
import java.io.File
import java.net.HttpURLConnection
import java.net.URL
import java.util.concurrent.Callable
import java.util.concurrent.Executors
import java.util.concurrent.Future

/**
 * 分享用的资源加载器，行为和 iOS 的 `WechatMediaLoader` 对齐。
 *
 * 来源支持 `https://` / `http://` 远程地址、`file://` 或裸绝对路径、`data:...;base64,`。
 * 缩略图有 32KB 硬上限，这里做「先缩尺寸再二分 JPEG 质量」并缓存结果。
 */
object WechatMediaLoader {
  /** 缩略图上限。Android SDK 常量 `THUMB_LENGTH_LIMIT` 是 64KB，和 iOS 一样取严的 32KB */
  const val THUMB_MAX_BYTES = 32 * 1024

  /** 微信里缩略图显示得很小，先按最长边缩到这个尺寸再压，省掉大量 JPEG 编码 */
  private const val THUMB_TARGET_MAX_SIDE = 320

  private const val CONNECT_TIMEOUT_MS = 15_000
  private const val READ_TIMEOUT_MS = 30_000

  /** 同一个 URL 的缩略图只下载 + 压缩一次；按字节数计量，上限 4MB */
  private val thumbCache = object : LruCache<String, ByteArray>(4 * 1024 * 1024) {
    override fun sizeOf(key: String, value: ByteArray) = value.size
  }

  /** 并行下载用；主媒体和缩略图同时下，串行的话是两次 RTT */
  private val io = Executors.newCachedThreadPool()

  fun <T> async(block: () -> T): Future<T> = io.submit(Callable(block))

  fun loadData(source: String, maxBytes: Int, label: String): ByteArray {
    val data = rawData(source, label)
    if (data.size > maxBytes) {
      throw WechatError(
        "ERR_WECHAT_MEDIA_TOO_LARGE",
        "$label 大小 ${data.size} 字节，超过微信上限 $maxBytes 字节"
      )
    }
    return data
  }

  /** 加载并压缩缩略图；`source` 为空时返回 null（微信允许没有缩略图） */
  fun loadThumbData(source: String?, maxBytes: Int = THUMB_MAX_BYTES): ByteArray? {
    if (source.isNullOrEmpty()) {
      return null
    }

    val cacheKey = "$source#$maxBytes"
    thumbCache.get(cacheKey)?.let { return it }

    val data = rawData(source, "缩略图")
    val result = if (data.size <= maxBytes) {
      data
    } else {
      val bitmap = BitmapFactory.decodeByteArray(data, 0, data.size)
        ?: throw WechatError("ERR_WECHAT_THUMB_INVALID", "缩略图不是有效的图片：$source")
      // 先一次性缩到展示尺寸，再二分质量；顺序反过来会白白编码好几张大图
      compress(downscale(bitmap, THUMB_TARGET_MAX_SIDE), maxBytes)
        ?: throw WechatError("ERR_WECHAT_THUMB_TOO_LARGE", "缩略图无法压缩到 $maxBytes 字节以内")
    }

    thumbCache.put(cacheKey, result)
    return result
  }

  /**
   * 落到本地临时文件并返回绝对路径。
   *
   * Android 的 `WXMusicVideoObject.hdAlbumThumbFilePath` 只收路径不收字节数组，
   * 所以远程/内联来源要先落盘。
   */
  fun loadToCacheFile(context: Context, source: String, maxBytes: Int, label: String): String {
    val data = loadData(source, maxBytes, label)
    val dir = File(context.cacheDir, "wechat").apply { mkdirs() }
    val file = File(dir, "media_${source.hashCode()}_${data.size}")
    if (!file.exists() || file.length() != data.size.toLong()) {
      file.writeBytes(data)
    }
    return file.absolutePath
  }

  // ---------------------------------------------------------------- private

  private fun rawData(source: String, label: String): ByteArray {
    if (source.startsWith("data:")) {
      val marker = source.indexOf(";base64,")
      if (marker < 0) {
        throw WechatError("ERR_WECHAT_MEDIA_INVALID", "$label 的 data: URI 解析失败")
      }
      return runCatching { Base64.decode(source.substring(marker + 8), Base64.DEFAULT) }
        .getOrElse { throw WechatError("ERR_WECHAT_MEDIA_INVALID", "$label 的 data: URI 解析失败") }
    }

    if (source.startsWith("http://") || source.startsWith("https://")) {
      return download(source, label)
    }

    val path = if (source.startsWith("file://")) source.removePrefix("file://") else source
    return runCatching { File(path).readBytes() }.getOrElse {
      throw WechatError(
        "ERR_WECHAT_MEDIA_READ_FAILED",
        "$label 读取失败：$path（远程图请传 http(s) 地址，相册资源请先导出成文件）"
      )
    }
  }

  private fun download(source: String, label: String): ByteArray {
    var connection: HttpURLConnection? = null
    try {
      connection = (URL(source).openConnection() as HttpURLConnection).apply {
        connectTimeout = CONNECT_TIMEOUT_MS
        readTimeout = READ_TIMEOUT_MS
        instanceFollowRedirects = true
      }
      val status = connection.responseCode
      if (status !in 200..299) {
        throw WechatError("ERR_WECHAT_MEDIA_DOWNLOAD_FAILED", "$label 下载失败：$status $source")
      }
      return connection.inputStream.use { it.readBytes() }
    } catch (error: WechatError) {
      throw error
    } catch (error: Exception) {
      throw WechatError("ERR_WECHAT_MEDIA_DOWNLOAD_FAILED", "$label 下载失败：${error.message}")
    } finally {
      connection?.disconnect()
    }
  }

  private fun downscale(bitmap: Bitmap, maxSide: Int): Bitmap {
    val longest = maxOf(bitmap.width, bitmap.height)
    if (longest <= maxSide) {
      return bitmap
    }
    val scale = maxSide.toFloat() / longest
    return Bitmap.createScaledBitmap(
      bitmap,
      (bitmap.width * scale).toInt().coerceAtLeast(1),
      (bitmap.height * scale).toInt().coerceAtLeast(1),
      true
    )
  }

  /** 先二分 JPEG 质量，压不下去就再缩尺寸重来；入参已过 downscale，正常一轮就够 */
  private fun compress(bitmap: Bitmap, maxBytes: Int): ByteArray? {
    var current = bitmap
    repeat(3) {
      binarySearchQuality(current, maxBytes)?.let { return it }
      current = downscale(current, (maxOf(current.width, current.height) * 0.6).toInt())
    }
    return null
  }

  private fun binarySearchQuality(bitmap: Bitmap, maxBytes: Int): ByteArray? {
    var low = 5
    var high = 100
    var best: ByteArray? = null

    // 7 次足够把区间收敛到 1% 以内
    repeat(7) {
      val mid = (low + high) / 2
      val stream = ByteArrayOutputStream()
      bitmap.compress(Bitmap.CompressFormat.JPEG, mid, stream)
      val data = stream.toByteArray()
      if (data.size <= maxBytes) {
        best = data
        low = mid
      } else {
        high = mid
      }
    }
    return best
  }
}

/** 微信对 title / description 有字节上限，超了整条消息会被丢弃，按 UTF-8 字节截断 */
fun String.truncatedUtf8(limit: Int): String {
  var result = this
  while (result.toByteArray(Charsets.UTF_8).size > limit && result.isNotEmpty()) {
    result = result.dropLast(1)
  }
  return result
}
