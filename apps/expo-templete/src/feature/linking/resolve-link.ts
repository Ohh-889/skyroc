import type { Href } from 'expo-router';

import { getToken } from '@/feature/auth';

/**
 * 外部链接 → 内部路由。深链、推送点击、扫码回跳都汇到这里，路由决策只有这一处。
 *
 * 三种形态的同一个目标：
 *
 * ```text
 * expotemplete.dev://demo/messages?from=link            自定义 scheme（app.config.ts 的 scheme，按环境带后缀）
 * https://<APP_LINK_HOST>/app/demo/messages?from=link   Universal Link / App Links（网页侧前缀 /app 会被切掉）
 * /demo/messages?from=push                              推送 payload 里下发的站内路径
 * ```
 *
 * 深链这条路已经接好了：`src/app/+native-intent.ts` 是 expo-router 的原生入口，进来就调本函数。
 *
 * 推送这条路要项目自己接——模板不预装 `expo-notifications`，也不替人选推送方案。装好之后，
 * 在根 `_layout` 里把「点击通知」的回调接到同一个函数上即可：
 *
 * ```ts
 * // 约定后端在 data.url 里下发**站内路径**（'/demo/messages?from=push'），不是完整 URL
 * const response = Notifications.useLastNotificationResponse();
 * const raw = response?.notification.request.content.data?.url;
 * const resolved = typeof raw === 'string' ? resolveLink(raw) : null;
 *
 * if (resolved?.blocked) setPendingLink(resolved.href); // 未登录：登录后由 usePendingLinkReplay 重放
 * else if (resolved) router.push(resolved.href);
 * ```
 *
 * 用 `useLastNotificationResponse` 而不是 `addNotificationResponseReceivedListener`：进程被杀后
 * 点通知冷启动时，事件在监听器注册之前就派发完了，只有前者还能把那条交出来。跳转前要等导航器
 * 挂载（`useRootNavigationState()?.key`），否则冷启动的第一次 push 会被丢掉。
 */

/**
 * 网页侧的路径前缀。Universal Link 是 `https://<host>/app/demo/messages`，路由里却是
 * `/demo/messages`——网站要在同一个域名下放落地页和 well-known 文件，不可能把域名根整个
 * 让给 App，所以约定 App 相关的链接都挂在 /app 下。改这里要同步改 app.config.ts 的 pathPrefix。
 */
const WEB_PREFIX = '/app';

/**
 * 允许被外部唤起的路由（前缀匹配）。**下面两条是示例，按自己的页面增删。**
 *
 * 必须是白名单而不是黑名单：深链和推送 payload 都来自 App 之外，谁都能构造一条。放开任意路径
 * 等于把「发一条链接就能把用户送进任意页面」当成功能——注销账号、支付确认页也都在里面。
 * 代价是新增可外部打开的页面时要手动加一行，这个动作本来就该是显式的。
 */
const ALLOWED_PREFIXES = ['/demo/messages', '/demo/orders'];

/** 登录流程本身。除此之外的一切都在 (app) 组里，需要先登录 */
const PUBLIC_PREFIXES = ['/login', '/phone-login', '/verify-code'];

export interface ResolvedLink {
  /** 目标需要登录但当前没登录。调用方负责先暂存（`setPendingLink`）再送去登录页 */
  blocked: boolean;
  href: Href;
}

/**
 * 把外部 URL 归一成 `/xxx` 形式的路由路径。
 *
 * 自定义 scheme 不能用 `new URL().pathname`：`expotemplete://demo/messages` 里的 `demo` 会被
 * 解析成 host，只取 pathname 会丢掉第一段变成 `/messages`。这里按 expo-router 自己的做法
 * （fork/extractPathFromURL.js）直接切掉 scheme。
 */
function toPath(raw: string) {
  // 推送 payload 下发的就是路由路径，没有 scheme
  if (raw.startsWith('/')) return raw;

  if (/^https?:\/\//.test(raw)) {
    try {
      const url = new URL(raw);

      return `${url.pathname}${url.search}`;
    } catch {
      return null;
    }
  }

  if (!raw.includes('://')) return null;

  return `/${raw.replace(/^[^:]+:\/\//, '')}`;
}

/**
 * 解析外部目标。认不出来返回 `null`，由调用方决定丢弃还是交回给路由走 +not-found。
 */
export function resolveLink(raw: string): null | ResolvedLink {
  const path = toPath(raw);

  if (!path) return null;

  const normalized = path.startsWith(WEB_PREFIX) ? path.slice(WEB_PREFIX.length) || '/' : path;

  // 查询串不参与白名单匹配，否则带 ?from=push 的链接会被判成不认识
  const pathname = normalized.split('?')[0];

  if (!ALLOWED_PREFIXES.some(prefix => pathname.startsWith(prefix))) return null;

  const needsAuth = !PUBLIC_PREFIXES.some(prefix => pathname.startsWith(prefix));

  return { blocked: needsAuth && !getToken(), href: normalized as Href };
}
