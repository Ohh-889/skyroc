import type { ConfigContext, ExpoConfig } from 'expo/config';

const BUNDLE_ID = 'com.example.skyroc';

// 来自 .env.${APP_ENV} 的构建期变量，不带 EXPO_PUBLIC_ 前缀 —— 只在这份配置里可见，
// 不会被打进 JS 包。dev / staging 给应用名加个后缀，好让人一眼看出装的是哪个包。
const APP_ENV = process.env.APP_ENV ?? 'development';

const APP_NAME_SUFFIX: Record<string, string> = {
  development: '内测版',
  production: '',
  staging: '抢先版'
};

const APP_NAME = `expo-templete${APP_NAME_SUFFIX[APP_ENV] ?? ''}`;

// 每套环境一个独立 scheme。三个包同时装在一台机上时，iOS 对同名 scheme 的归属是未定义的
// （基本是最后装的那个赢），联调时就会出现「点 dev 的链接打开了 staging 包」。
// 深链形如 expotemplete.dev://demo/message/42，改动必须重新 build，不能 OTA。
const SCHEME_SUFFIX: Record<string, string> = {
  development: '.dev',
  production: '',
  staging: '.staging'
};

const SCHEME = `expotemplete${SCHEME_SUFFIX[APP_ENV] ?? ''}`;

// Universal Link / Android App Links 的域名。iOS 要在这个域名下放 /.well-known/apple-app-site-association，
// Android 要放 /.well-known/assetlinks.json，两个文件都必须 https、无重定向、Content-Type 为 application/json。
// 网页侧路径统一挂在 /app 下（见 feature/linking 的 WEB_PREFIX），和微信回跳用的 /process/ 错开。
const APP_LINK_HOST = process.env.APP_LINK_HOST;

// 微信开放平台「移动应用」的 AppID 与 Universal Link，改成自己的
// Universal Link 必须是自己域名下、以 / 结尾的 https 地址，且和开放平台后台填的完全一致
const WECHAT_APP_ID = process.env.WECHAT_APP_ID;

const WECHAT_UNIVERSAL_LINK = process.env.WECHAT_UNIVERSAL_LINK;

// Live Activity 的远程更新要给 App 加 aps-environment 权限，用不带推送能力的证书签名会直接失败，
// 所以默认关掉，需要联调后端推送时 LIVE_ACTIVITY_PUSH=1 再 prebuild
const LIVE_ACTIVITY_PUSH = process.env.LIVE_ACTIVITY_PUSH === '1';

// 版本信息由 `pnpm build:apk` / `pnpm build:ipa` 注入（见 scripts/）：version 是命令行传的 x.y.z，
// versionCode / buildNumber 是「同一个 version 又打了一次包」的计数器，存在 .app-version.json 里自增。
// 两个商店都要求这个计数器单调递增，重复的号会被直接退回。
// 本地起 dev server 时这三个变量为空，回落到默认值即可 —— 调试包不进商店。
const APP_VERSION = process.env.APP_VERSION ?? '1.0.0';

const APP_VERSION_CODE = Number(process.env.APP_VERSION_CODE ?? 1);

const APP_BUILD_NUMBER = process.env.APP_BUILD_NUMBER ?? '1';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: APP_NAME,
  slug: 'expo-templete',
  version: APP_VERSION,
  orientation: 'portrait',
  platforms: ['ios', 'android'],
  icon: './assets/images/icon.png',
  scheme: SCHEME,
  userInterfaceStyle: 'automatic',
  ios: {
    icon: './assets/expo.icon',
    bundleIdentifier: BUNDLE_ID,
    buildNumber: APP_BUILD_NUMBER,
    // 非生产环境带上 ?mode=developer：跳过 Apple CDN 对 AASA 文件的缓存，改完域名侧的文件立刻生效。
    // 生产包不要带
    associatedDomains: [`applinks:${APP_LINK_HOST}${APP_ENV === 'production' ? '' : '?mode=developer'}`]
  },
  android: {
    package: BUNDLE_ID,
    versionCode: APP_VERSION_CODE,
    intentFilters: [
      {
        action: 'VIEW',
        // 少了这行就只是普通 deep link：点链接会弹「用什么打开」的选择器，而不是直接进 App。
        // 它生效的前提是 assetlinks.json 里的 sha256 指纹和实际签名一致，
        // 上架后要换成 Play Console「应用签名」里的那份，不是本地 keystore 的
        autoVerify: true,
        category: ['BROWSABLE', 'DEFAULT'],
        data: [{ host: APP_LINK_HOST, pathPrefix: '/app', scheme: 'https' }]
      }
    ],
    adaptiveIcon: {
      backgroundColor: '#E6F4FE',
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png'
    },
    predictiveBackGestureEnabled: false
  },
  plugins: [
    'expo-router',
    'expo-secure-store',
    [
      // 应用锁（见 src/feature/auth/use-app-lock）。这段文案会写进 Info.plist 的
      // NSFaceIDUsageDescription，缺了它 iOS 上第一次调用面容验证会直接崩。
      // 和其它原生配置一样，改了必须重新 build，OTA 覆盖不到
      'expo-local-authentication',
      {
        faceIDPermission: '使用面容 ID 验证身份后才能查看账户信息'
      }
    ],
    [
      '@skyroc/expo-bluetooth',
      {
        bluetoothAlwaysPermission: '需要使用蓝牙来连接附近的设备'
      }
    ],
    [
      '@skyroc/expo-wechat',
      {
        appId: WECHAT_APP_ID,
        universalLink: WECHAT_UNIVERSAL_LINK
      }
    ],
    // 让 canOpenURL 能探测到高德 / 百度 / 腾讯地图，见 src/feature/map-link
    './plugins/with-map-app-links',
    [
      // 灵动岛 / 锁屏的 Live Activity。插件在 prebuild 时生成 Widget Extension 靶子、
      // 配好 App Group，并往 Info.plist 写 NSSupportsLiveActivities。
      // 没有 widgets 配置项就只有 Live Activity，没有桌面小组件——这里正是这种情况。
      'expo-widgets',
      {
        enablePushNotifications: LIVE_ACTIVITY_PUSH,
        // App 与 widget 进程共享数据的容器，要在 Apple Developer 后台注册同名 App Group
        groupIdentifier: `group.${BUNDLE_ID}`
      }
    ],
    [
      'expo-splash-screen',
      {
        backgroundColor: '#208AEF',
        // 启动图是原生画的，运行时的主题它读不到，只能靠这份 dark 变体：系统外观是暗色时原生自己挑这一套。
        // 前提是上面的 userInterfaceStyle 为 automatic，锁成 light 的话这套永远不会出现。
        // 也因此「用户手动选了深色但系统是浅色」这一种组合，启动图仍然是浅色的——原生阶段 JS 还没起来，
        // 读不到偏好，除非把偏好写进原生存储
        dark: {
          backgroundColor: '#0B1220',
          image: './assets/images/splash-icon.png',
          imageWidth: 76
        },
        image: './assets/images/splash-icon.png',
        imageWidth: 76
      }
    ]
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true
  }
});
