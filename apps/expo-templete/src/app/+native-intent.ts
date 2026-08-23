import Constants from 'expo-constants';

import { resolveLink, setPendingLink } from '@/feature/linking';

/**
 * 所有外部链接进 App 的唯一入口。
 *
 * expo-router 的 linking 配置是 `prefixes: []`：任何 URL 都会被剥掉 scheme / origin 后
 * 直接当路由路径去匹配。好处是自定义 scheme 和 Universal Link 天然同一套路由，代价是
 * 「域名下的任意网页路径」也会被当成路由，匹配不上就落 +not-found。所以外部 URL 到内部
 * 路由的映射、以及未登录时的拦截，都必须在这里做完——它跑在导航器挂载**之前**，
 * 是唯一能在用户看到任何一帧之前改写目标的地方。
 */

const WECHAT_PLUGIN = '@skyroc/expo-wechat';

/** 从内嵌的 app config 里读插件参数，避免和 app.config.ts 里的值写两份 */
const wechatProps = (() => {
  const entry = Constants.expoConfig?.plugins?.find(plugin => Array.isArray(plugin) && plugin[0] === WECHAT_PLUGIN);
  const props = (Array.isArray(entry) ? entry[1] : undefined) as { appId?: string; universalLink?: string } | undefined;
  return props ?? {};
})();

const wechatUniversalLink = wechatProps.universalLink ? new URL(wechatProps.universalLink) : null;

/**
 * 微信回跳有两条通道：Universal Link，以及以 AppID 为 scheme 的兜底 URL。
 *
 * 只比对**路径前缀**而不是整个域名：微信的回跳地址和业务深链通常在同一个域名下
 * （见 app.config.ts 的 APP_LINK_HOST 与 WECHAT_UNIVERSAL_LINK），按 host 判断会把
 * /app/... 的业务深链一起吞掉。
 */
function isWechatCallback(url: string) {
  if (wechatProps.appId && url.startsWith(`${wechatProps.appId}://`)) return true;

  if (!wechatUniversalLink || !url.startsWith('https://')) return false;

  try {
    const parsed = new URL(url);

    return parsed.host === wechatUniversalLink.host && parsed.pathname.startsWith(wechatUniversalLink.pathname);
  } catch {
    return false;
  }
}

export function redirectSystemPath({ path }: { initial: boolean; path: string }) {
  try {
    // 「取消授权」回来时是 https://<universalLink>/?... ，按路由解析会跳到 +not-found。
    // 授权结果本身由原生模块的回调送达，不需要走路由，这里直接丢弃
    if (isWechatCallback(path)) return null;

    const resolved = resolveLink(path);

    // 不在白名单里的外部链接：原样交回给路由，落 +not-found。
    // 静默吞掉更「干净」，但用户会看到点了链接毫无反应，且没有任何排查线索
    if (!resolved) return path;

    // 未登录点了详情深链：先记下目标再送去登录页。
    // 这一步必须发生在这里——放到页面里做的话，`Stack.Protected` 会先把用户弹回 (auth)，
    // 深链目标那时已经丢了
    if (resolved.blocked) {
      setPendingLink(resolved.href);

      return '/login';
    }

    return resolved.href as string;
  } catch (error) {
    // 这里抛错等于整个 App 打不开（getInitialURL 阶段），任何情况下都得给出一个能走的路径
    console.warn('[native-intent] 解析深链失败', error);

    return path;
  }
}
