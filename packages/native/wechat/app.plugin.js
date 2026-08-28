const fs = require('node:fs');
const path = require('node:path');

const {
  AndroidConfig,
  createRunOncePlugin,
  withAndroidManifest,
  withDangerousMod,
  withEntitlementsPlist,
  withInfoPlist,
  withXcodeProject
} = require('expo/config-plugins');

/** 微信 SDK 需要能探测到的三个 scheme，且必须落在前 50 个白名单里 */
const WECHAT_QUERY_SCHEMES = ['weixin', 'weixinULAPI', 'weixinURLParamsAPI'];

const WX_ENTRY_ACTIVITY = '.wxapi.WXEntryActivity';

function assertProps(props) {
  const { appId, universalLink } = props ?? {};
  if (!appId || !appId.startsWith('wx')) {
    throw new Error('[wechat] 缺少 appId（开放平台移动应用的 AppID，形如 wx1234567890abcdef）');
  }
  if (!universalLink || !universalLink.startsWith('https://') || !universalLink.endsWith('/')) {
    throw new Error(
      '[wechat] universalLink 必须是 https 开头、以 / 结尾的 Universal Link，且与开放平台后台填写的完全一致'
    );
  }
  return { appId, universalLink };
}

// ---------------------------------------------------------------- iOS

const withWechatInfoPlist = (config, { appId, universalLink }) =>
  withInfoPlist(config, cfg => {
    const plist = cfg.modResults;

    // 原生侧从这两个键读配置，JS 不需要再传一次 AppID
    plist.WXAppID = appId;
    plist.WXUniversalLink = universalLink;

    // 回跳 scheme 必须就是 AppID 本身
    plist.CFBundleURLTypes = plist.CFBundleURLTypes ?? [];
    const registered = plist.CFBundleURLTypes.some(entry => entry.CFBundleURLSchemes?.includes(appId));
    if (!registered) {
      plist.CFBundleURLTypes.push({ CFBundleURLName: 'weixin', CFBundleURLSchemes: [appId] });
    }

    // 把微信的三项排到最前面，避免被别的 scheme 挤出前 50
    const existing = plist.LSApplicationQueriesSchemes ?? [];
    plist.LSApplicationQueriesSchemes = [
      ...WECHAT_QUERY_SCHEMES,
      ...existing.filter(scheme => !WECHAT_QUERY_SCHEMES.includes(scheme))
    ];

    return cfg;
  });

const withWechatAssociatedDomains = (config, { universalLink }) =>
  withEntitlementsPlist(config, cfg => {
    const domain = `applinks:${new URL(universalLink).host}`;
    const domains = cfg.modResults['com.apple.developer.associated-domains'] ?? [];
    if (!domains.includes(domain)) {
      domains.push(domain);
    }
    cfg.modResults['com.apple.developer.associated-domains'] = domains;
    return cfg;
  });

const withWechatSimulatorArchFix = config =>
  withXcodeProject(config, cfg => {
    // WechatOpenSDK-XCFramework 的 podspec 仍然给使用方塞了
    // EXCLUDED_ARCHS[sdk=iphonesimulator*] = arm64（历史遗留，2.0.7 已带 arm64 模拟器切片）。
    // 不覆盖的话 Apple Silicon 上的模拟器构建会链接失败。
    // 键里有 `[]`，pbxproj 要求整个键名带引号，否则生成的工程文件解析不了
    cfg.modResults.addBuildProperty('"EXCLUDED_ARCHS[sdk=iphonesimulator*]"', '""');
    return cfg;
  });

// ------------------------------------------------------------ Android

const withWechatAndroidManifest = (config, { appId }) =>
  withAndroidManifest(config, cfg => {
    const application = AndroidConfig.Manifest.getMainApplicationOrThrow(cfg.modResults);
    const androidPackage = AndroidConfig.Package.getPackage(cfg);

    AndroidConfig.Manifest.addMetaDataItemToMainApplication(application, 'WX_APP_ID', appId);

    application.activity = application.activity ?? [];
    const declared = application.activity.some(activity => activity.$['android:name'] === WX_ENTRY_ACTIVITY);
    if (!declared) {
      application.activity.push({
        $: {
          'android:name': WX_ENTRY_ACTIVITY,
          'android:exported': 'true',
          'android:launchMode': 'singleTask',
          // 必须和主应用同一个 task，否则回跳后会另开一个空任务
          'android:taskAffinity': androidPackage,
          'android:theme': '@android:style/Theme.Translucent.NoTitleBar'
        }
      });
    }

    return cfg;
  });

const withWechatEntryActivity = config =>
  withDangerousMod(config, [
    'android',
    async cfg => {
      const androidPackage = AndroidConfig.Package.getPackage(cfg);
      if (!androidPackage) {
        throw new Error('[wechat] 读不到 android.package，无法生成 WXEntryActivity');
      }

      // 微信是按 `${applicationId}.wxapi.WXEntryActivity` 这个固定类名拉起 Activity 的，
      // 包名随 app 变，所以只能在 prebuild 时生成到应用工程里。
      const dir = path.join(
        cfg.modRequest.platformProjectRoot,
        'app/src/main/java',
        ...androidPackage.split('.'),
        'wxapi'
      );
      await fs.promises.mkdir(dir, { recursive: true });
      await fs.promises.writeFile(
        path.join(dir, 'WXEntryActivity.kt'),
        `// 由 @skyroc/expo-wechat 的 app.plugin.js 在 prebuild 时生成，请勿手动修改
package ${androidPackage}.wxapi

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import expo.modules.wechat.WechatSDK

class WXEntryActivity : Activity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    consume(intent)
  }

  override fun onNewIntent(intent: Intent) {
    super.onNewIntent(intent)
    setIntent(intent)
    consume(intent)
  }

  private fun consume(intent: Intent?) {
    WechatSDK.handleIntent(this, intent ?: return)
    // 进程被杀后从微信回来时这里是任务栈根，直接 finish 会只留一个空任务
    if (isTaskRoot) {
      packageManager.getLaunchIntentForPackage(packageName)?.let(::startActivity)
    }
    finish()
  }
}
`,
        'utf8'
      );

      return cfg;
    }
  ]);

// ---------------------------------------------------------------- 入口

const withWechat = (config, props) => {
  const options = assertProps(props);

  return [
    cfg => withWechatInfoPlist(cfg, options),
    cfg => withWechatAssociatedDomains(cfg, options),
    withWechatSimulatorArchFix,
    cfg => withWechatAndroidManifest(cfg, options),
    withWechatEntryActivity
  ].reduce((acc, apply) => apply(acc), config);
};

module.exports = createRunOncePlugin(withWechat, '@skyroc/expo-wechat', '1.0.0');
