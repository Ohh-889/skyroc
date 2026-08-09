import { hasAuthorizedRoutePath, hasMatchedRoutePermission, normalizePath } from '@skyroc/web-admin-layouts';
import { redirect } from '@tanstack/react-router';
import type {MakeRouteMatchUnion, ParsedLocation} from '@tanstack/react-router'

export interface AdminRouteGuardOptions {
  context: Router.RouterContext;
  location: ParsedLocation;
  matches: MakeRouteMatchUnion[];
  preload?: boolean;
}



function getLoginRedirectSearch(location: ParsedLocation, context: Router.RouterContext) {
  const homeRoute = normalizePath(context.homeRoute || context.getHomeRoute());

  const currentPath = normalizePath(location.pathname);

  if (currentPath === homeRoute && !location.searchStr) {
    return;
  }

  return { redirect: location.href };
}

function getCurrentRoutePath(matches: MakeRouteMatchUnion[]) {
  const currentMatch = matches.at(-1);

  if (!currentMatch) {
    return null;
  }

  return normalizePath(currentMatch.fullPath);
}

function getMatchedRouteHref(matches: MakeRouteMatchUnion[]) {
  return matches.findLast(match => match.staticData?.href)?.staticData?.href || null;
}

function getRouteSwitchFallbackPath(context: Router.RouterContext, currentRoutePath: string | null) {
  const homeRoute = normalizePath(context.homeRoute || context.getHomeRoute());

  if (currentRoutePath !== homeRoute) {
    return homeRoute;
  }

  return '/404';
}


async  function resolveUserInfo(context: Router.RouterContext) {
  if (context.isAuthInitialized && context.userInfo) {
    return context.userInfo;
  }

 return  context.initAuth();
}

async function guardResolvedUserInfo(
  options: AdminRouteGuardOptions,
  userInfo: Api.Auth.UserInfo | null
){
  const { context, location, matches, preload } = options;

  if (!userInfo) {
    // 等登出走完再跳：/login 的守卫会重新读 token，没清完就跳过去会被当成还登录着。
    // 只有 initAuth 落空才走到这里，那条路本来就是异步的，下面 isPromise 那条同步快路不受影响。
    await context.logout()

    throw redirect({ to: '/login', search: getLoginRedirectSearch(location, context) });
  }

  if (import.meta.env.VITE_AUTH_ROUTE_MODE === 'static' && !hasMatchedRoutePermission(matches, userInfo)) {
    throw redirect({ to: '/403' });
  }

  const currentRoutePath = getCurrentRoutePath(matches);

  if (currentRoutePath && !hasAuthorizedRoutePath(currentRoutePath, userInfo)) {
    throw redirect({ to: '/403' });
  }

  const href = getMatchedRouteHref(matches);

  if (href && !preload) {
    window.open(href, '_blank', 'noopener,noreferrer');

    throw redirect({ to: getRouteSwitchFallbackPath(context, currentRoutePath), replace: true });
  }
}

export async function guardAdminRoute(options: AdminRouteGuardOptions) {
  const { context, location } = options;

  if (!context.isLoggedIn) {
    throw redirect({ to: '/login', search: getLoginRedirectSearch(location, context) });
  }

  const userInfo = await resolveUserInfo(context);

  console.log('userInfo',userInfo);

  return await guardResolvedUserInfo(options, userInfo);
}
