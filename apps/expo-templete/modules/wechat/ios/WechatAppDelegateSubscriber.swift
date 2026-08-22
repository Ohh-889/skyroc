import ExpoModulesCore
import WechatOpenSDK

/// 把微信需要的 AppDelegate 生命周期钩子接到 `WechatSDK` 上。
///
/// 注册在 `expo-module.config.json` 的 `apple.appDelegateSubscribers`，
/// 因此不需要改动 `ios/expotemplete/AppDelegate.swift`（那份文件是 prebuild 生成的）。
public class WechatAppDelegateSubscriber: ExpoAppDelegateSubscriber {
  public func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    // 必须早于任何 handleOpenURL，否则从微信冷启动回来的那次回调会丢
    WechatSDK.shared.register()
    return true
  }

  public func application(
    _ app: UIApplication,
    open url: URL,
    options: [UIApplication.OpenURLOptionsKey: Any] = [:]
  ) -> Bool {
    return WXApi.handleOpen(url, delegate: WechatSDK.shared)
  }

  public func application(
    _ application: UIApplication,
    continue userActivity: NSUserActivity,
    restorationHandler: @escaping ([any UIUserActivityRestoring]?) -> Void
  ) -> Bool {
    return WXApi.handleOpenUniversalLink(userActivity, delegate: WechatSDK.shared)
  }

  // 下面两个用于兜底：用户切到微信后没完成操作就回来，不然槽会被永久占住
  public func applicationWillResignActive(_ application: UIApplication) {
    WechatSDK.shared.handleWillResignActive()
  }

  public func applicationDidBecomeActive(_ application: UIApplication) {
    WechatSDK.shared.handleDidBecomeActive()
  }
}
