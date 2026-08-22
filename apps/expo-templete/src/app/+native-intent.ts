import Constants from 'expo-constants';

/**
 * expo-router 的 deep link 拦截钩子。
 *
 * 它对进来的 URL 不做来源过滤（linking 配置里 `prefixes: []`），https 链接会被直接
 * 截成路径去匹配路由。微信在 iOS 上正是用 Universal Link 把 App 拉回前台的，
 * 于是「取消授权」回来时 `https://<universalLink>/?...` 会被解析成一个不存在的路由，
 * 跳到 +not-found。授权结果本身由原生模块的回调送达，不需要走路由，这里直接丢弃。
 */

const WECHAT_PLUGIN = '@skyroc/expo-wechat';

/** 从内嵌的 app config 里读插件参数，避免和 app.config.ts 里的值写两份 */
const wechatProps = (() => {
  const entry = Constants.expoConfig?.plugins?.find(
    plugin => Array.isArray(plugin) && plugin[0] === WECHAT_PLUGIN,
  );
  const props = (Array.isArray(entry) ? entry[1] : undefined) as
    | { appId?: string; universalLink?: string }
    | undefined;
  return props ?? {};
})();

const wechatHost = wechatProps.universalLink ? new URL(wechatProps.universalLink).host : null;

/** 微信回跳有两条通道：Universal Link，以及以 AppID 为 scheme 的兜底 URL */
function isWechatCallback(url: string) {
  if (wechatProps.appId && url.startsWith(`${wechatProps.appId}://`)) return true;
  if (!wechatHost || !url.startsWith('https://')) return false;
  try {
    return new URL(url).host === wechatHost;
  } catch {
    return false;
  }
}

export function redirectSystemPath({ path }: { initial: boolean; path: string }) {
  return isWechatCallback(path) ? null : path;
}
