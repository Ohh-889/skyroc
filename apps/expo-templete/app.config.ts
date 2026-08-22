import type { ConfigContext, ExpoConfig } from 'expo/config';


const BUNDLE_ID = 'com.example.skyroc';

// 微信开放平台「移动应用」的 AppID 与 Universal Link，改成自己的
// Universal Link 必须是自己域名下、以 / 结尾的 https 地址，且和开放平台后台填的完全一致
const WECHAT_APP_ID = process.env.WECHAT_APP_ID ?? '000000000';
const WECHAT_UNIVERSAL_LINK = process.env.WECHAT_UNIVERSAL_LINK ?? 'https://example.com/app/';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'expo-templete',
  slug: 'expo-templete',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'expotemplete',
  userInterfaceStyle: 'automatic',
  ios: {
    icon: './assets/expo.icon',
    bundleIdentifier: BUNDLE_ID
  },
  android: {
    package: BUNDLE_ID,
    adaptiveIcon: {
      backgroundColor: '#E6F4FE',
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png'
    },
    predictiveBackGestureEnabled: false
  },
  web: {
    output: 'static',
    favicon: './assets/images/favicon.png'
  },
  plugins: [
    'expo-router',
    'expo-secure-store',
    [
      './modules/wechat/app.plugin.js',
      {
        appId: WECHAT_APP_ID,
        universalLink: WECHAT_UNIVERSAL_LINK
      }
    ],
    [
      'expo-splash-screen',
      {
        backgroundColor: '#208AEF',
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
