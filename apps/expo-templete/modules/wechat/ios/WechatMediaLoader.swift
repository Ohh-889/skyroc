import UIKit

/// 分享用的资源加载器。
///
/// 微信要的是 `NSData`，而 JS 侧给过来的是一个字符串来源，可能是：
/// - `https://` / `http://` 远程地址
/// - `file://` 或裸绝对路径（`expo-file-system`、相册导出的临时文件都是这种）
/// - `data:image/png;base64,...`
///
/// 缩略图另有一层麻烦：`thumbData` 有 32KB 硬上限，`setThumbImage:` 并不保证压得下来，
/// 所以这里自己做「先缩尺寸再二分 JPEG 质量」。
enum WechatMediaLoader {
  /// 缩略图上限。官方文档写 32KB，SDK 头文件注释写 64K，取严的那个。
  static let thumbMaxBytes = 32 * 1024

  /// 微信里缩略图显示得很小，先按最大边缩到这个尺寸再压。
  /// 直接在原图（比如 1200×1200）上二分 JPEG 质量的话，每一轮都要全尺寸编码一次，
  /// 七轮下来是几百毫秒起步——这是之前分享图片/网页卡一两秒的主因之一。
  private static let thumbTargetMaxSide: CGFloat = 320

  /// 同一个 URL 的缩略图只下载 + 压缩一次。
  /// 分享入口通常反复用同几张封面图，缓存命中率很高。
  private static let thumbCache = NSCache<NSString, NSData>()

  static func loadData(from source: String, maxBytes: Int, label: String) async throws -> Data {
    let data = try await rawData(from: source, label: label)
    guard data.count <= maxBytes else {
      throw WechatError(
        code: "ERR_WECHAT_MEDIA_TOO_LARGE",
        message: "\(label) 大小 \(data.count) 字节，超过微信上限 \(maxBytes) 字节"
      )
    }
    return data
  }

  /// 加载并压缩缩略图；`source` 为空时返回 nil（微信允许没有缩略图）
  static func loadThumbData(from source: String?, maxBytes: Int = thumbMaxBytes) async throws -> Data? {
    guard let source, !source.isEmpty else {
      return nil
    }

    let cacheKey = "\(source)#\(maxBytes)" as NSString
    if let cached = thumbCache.object(forKey: cacheKey) {
      return cached as Data
    }

    let data = try await rawData(from: source, label: "缩略图")
    let thumbData: Data

    if data.count <= maxBytes {
      thumbData = data
    } else {
      guard let image = UIImage(data: data) else {
        throw WechatError(code: "ERR_WECHAT_THUMB_INVALID", message: "缩略图不是有效的图片：\(source)")
      }
      // 先一次性缩到展示尺寸，再二分质量；顺序反过来会白白编码好几张大图
      let scaled = downscale(image, maxSide: thumbTargetMaxSide)
      guard let compressed = compress(scaled, maxBytes: maxBytes) else {
        throw WechatError(code: "ERR_WECHAT_THUMB_TOO_LARGE", message: "缩略图无法压缩到 \(maxBytes) 字节以内")
      }
      thumbData = compressed
    }

    thumbCache.setObject(thumbData as NSData, forKey: cacheKey)
    return thumbData
  }

  // MARK: - Private

  private static func rawData(from source: String, label: String) async throws -> Data {
    if source.hasPrefix("data:") {
      guard
        let separator = source.range(of: ";base64,"),
        let data = Data(base64Encoded: String(source[separator.upperBound...]))
      else {
        throw WechatError(code: "ERR_WECHAT_MEDIA_INVALID", message: "\(label) 的 data: URI 解析失败")
      }
      return data
    }

    if let url = URL(string: source), let scheme = url.scheme?.lowercased(), scheme == "http" || scheme == "https" {
      do {
        let (data, response) = try await URLSession.shared.data(from: url)
        guard let http = response as? HTTPURLResponse, (200..<300).contains(http.statusCode) else {
          throw WechatError(
            code: "ERR_WECHAT_MEDIA_DOWNLOAD_FAILED",
            message: "\(label) 下载失败：\((response as? HTTPURLResponse)?.statusCode ?? -1) \(source)"
          )
        }
        return data
      } catch let error as WechatError {
        throw error
      } catch {
        throw WechatError(
          code: "ERR_WECHAT_MEDIA_DOWNLOAD_FAILED",
          message: "\(label) 下载失败：\(error.localizedDescription)"
        )
      }
    }

    // file:// 或裸路径
    let path = source.hasPrefix("file://") ? (URL(string: source)?.path ?? source) : source
    do {
      return try Data(contentsOf: URL(fileURLWithPath: path))
    } catch {
      throw WechatError(
        code: "ERR_WECHAT_MEDIA_READ_FAILED",
        message: "\(label) 读取失败：\(path)（远程图请传 http(s) 地址，相册资源请先导出成文件）"
      )
    }
  }

  /// 按最大边等比缩放；已经够小就原样返回
  private static func downscale(_ image: UIImage, maxSide: CGFloat) -> UIImage {
    let longest = max(image.size.width, image.size.height)
    guard longest > maxSide else {
      return image
    }
    return resize(image, scale: maxSide / longest) ?? image
  }

  /// 先二分 JPEG 质量，压不下去就再缩尺寸重来，最多 3 轮
  /// （入参已经过 downscale，正常一轮就够）
  private static func compress(_ image: UIImage, maxBytes: Int) -> Data? {
    var current = image

    for _ in 0..<3 {
      if let data = binarySearchQuality(current, maxBytes: maxBytes) {
        return data
      }
      guard let smaller = resize(current, scale: 0.6) else {
        return nil
      }
      current = smaller
    }
    return nil
  }

  private static func binarySearchQuality(_ image: UIImage, maxBytes: Int) -> Data? {
    var low: CGFloat = 0.05
    var high: CGFloat = 1
    var best: Data?

    // 7 次足够把区间收敛到 1% 以内
    for _ in 0..<7 {
      let mid = (low + high) / 2
      guard let data = image.jpegData(compressionQuality: mid) else {
        return best
      }
      if data.count <= maxBytes {
        best = data
        low = mid
      } else {
        high = mid
      }
    }
    return best
  }

  private static func resize(_ image: UIImage, scale: CGFloat) -> UIImage? {
    let size = CGSize(width: image.size.width * scale, height: image.size.height * scale)
    guard size.width >= 1, size.height >= 1 else {
      return nil
    }
    return UIGraphicsImageRenderer(size: size).image { _ in
      image.draw(in: CGRect(origin: .zero, size: size))
    }
  }
}

extension String {
  /// 微信对 title / description 有字节上限，超了整条消息会被丢弃，这里按 UTF-8 字节截断
  func truncated(utf8Bytes limit: Int) -> String {
    guard utf8.count > limit else {
      return self
    }
    var result = self
    while result.utf8.count > limit, !result.isEmpty {
      result.removeLast()
    }
    return result
  }
}
