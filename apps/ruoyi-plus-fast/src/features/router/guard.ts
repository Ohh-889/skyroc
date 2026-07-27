import {
  hasAuthorizedRoutePath,
  hasMatchedRoutePermission,
  normalizePath
} from '@skyroc/web-admin-layouts';
import { redirect } from '@tanstack/react-router';

export interface AdminRouteGuardOptions {
  context: AdminRouteGuardContext;
  location: AdminRouteLocation;
  matches: AdminRouteMatch[];
  preload?: boolean;
}

interface AdminRouteLocation {
  href: string;
  pathname: string;
  searchStr: string;
}

interface AdminRouteMeta {
  href?: string | null;
  permissions?: string[];
}

interface AdminRouteMatch {
  fullPath: string;
  staticData?: AdminRouteMeta;
}

interface AdminRouteGuardContext {
  clearAuth: () => void;
  getHomeRoute: () => string;
  homeRoute?: string;
  initAuth: () => Promise<Api.Auth.UserInfo | null>;
  isAuthInitialized: boolean;
  isLoggedIn: boolean;
  userInfo?: Api.Auth.UserInfo;
}

export type AdminRouteGuardResult = Promise<void> | void;
type UserInfoResult = Api.Auth.UserInfo | Promise<Api.Auth.UserInfo | null> | null;

function getLoginRedirectSearch(location: AdminRouteLocation, context: AdminRouteGuardContext) {
  const homeRoute = normalizePath(context.homeRoute || context.getHomeRoute());
  const currentPath = normalizePath(location.pathname);

  if (currentPath === homeRoute && !location.searchStr) {
    return undefined;
  }

  return { redirect: location.href };
}

function getCurrentRoutePath(matches: AdminRouteMatch[]) {
  const currentMatch = matches.at(-1);

  if (!currentMatch) {
    return null;
  }

  return normalizePath(currentMatch.fullPath);
}

function getMatchedRouteHref(matches: AdminRouteMatch[]) {
  return matches.findLast(match => match.staticData?.href)?.staticData?.href || null;
}

function getRouteSwitchFallbackPath(context: AdminRouteGuardContext, currentRoutePath: string | null) {
  const homeRoute = normalizePath(context.homeRoute || context.getHomeRoute());

  if (currentRoutePath !== homeRoute) {
    return homeRoute;
  }

  return '/404';
}

function isPromise<T>(value: T | Promise<T>): value is Promise<T> {
  return value instanceof Promise;
}

function resolveUserInfo(context: AdminRouteGuardContext): UserInfoResult {
  if (context.isAuthInitialized && context.userInfo) {
    return context.userInfo;
  }

  return context.initAuth();
}

function guardResolvedUserInfo(options: AdminRouteGuardOptions, userInfo: Api.Auth.UserInfo | null) {
  const { context, location, matches, preload } = options;

  if (!userInfo) {
    context.clearAuth();

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

export function guardAdminRoute(options: AdminRouteGuardOptions): AdminRouteGuardResult {
  const { context, location } = options;

  if (!context.isLoggedIn) {
    throw redirect({ to: '/login', search: getLoginRedirectSearch(location, context) });
  }

  const userInfo = resolveUserInfo(context);

  if (isPromise(userInfo)) {
    return userInfo.then(data => guardResolvedUserInfo(options, data));
  }

  return guardResolvedUserInfo(options, userInfo);
}
