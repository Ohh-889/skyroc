const { createRunOncePlugin, withAndroidManifest, withInfoPlist } = require('expo/config-plugins');

/**
 * 地图 App 的 scheme。
 *
 * Linking.canOpenURL 默认查不到任何第三方 App：iOS 9+ 只认 Info.plist 里白名单过的 scheme，
 * Android 11+ 只认 AndroidManifest 里 queries 声明过的。两端都不声明的话探测恒为 false，
 * 地图面板会永远只剩系统自带的 Apple 地图。
 *
 * `maps` 是 iOS 自带地图，第三方三家两端通用。
 */
const IOS_SCHEMES = ['iosamap', 'baidumap', 'qqmap', 'maps'];
const ANDROID_SCHEMES = ['amapuri', 'baidumap', 'qqmap'];

const withMapInfoPlist = config =>
  withInfoPlist(config, cfg => {
    const existing = cfg.modResults.LSApplicationQueriesSchemes ?? [];

    // 追加在已有项之后：微信插件特意把自己排在最前（iOS 只认前 50 条），别把它挤下去
    cfg.modResults.LSApplicationQueriesSchemes = [
      ...existing,
      ...IOS_SCHEMES.filter(scheme => !existing.includes(scheme))
    ];

    return cfg;
  });

const withMapAndroidQueries = config =>
  withAndroidManifest(config, cfg => {
    const manifest = cfg.modResults.manifest;

    manifest.queries = manifest.queries ?? [];
    if (manifest.queries.length === 0) {
      manifest.queries.push({});
    }

    const queries = manifest.queries[0];
    queries.intent = queries.intent ?? [];

    const declared = new Set(
      queries.intent.flatMap(intent => (intent.data ?? []).map(data => data.$['android:scheme']))
    );

    for (const scheme of ANDROID_SCHEMES.filter(item => !declared.has(item))) {
      queries.intent.push({
        action: [{ $: { 'android:name': 'android.intent.action.VIEW' } }],
        category: [{ $: { 'android:name': 'android.intent.category.BROWSABLE' } }],
        data: [{ $: { 'android:scheme': scheme } }]
      });
    }

    return cfg;
  });

const withMapAppLinks = config => withMapAndroidQueries(withMapInfoPlist(config));

module.exports = createRunOncePlugin(withMapAppLinks, 'with-map-app-links', '1.0.0');
