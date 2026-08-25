import { getAdminLayoutsOptions } from '../../setup';

interface PermissionRouteMatch {
  staticData?: Router.Meta;
}

export function hasAnyRoutePermission(permissions: string[] | null | undefined, userInfo?: Api.Auth.UserInfo | null) {
  if (!permissions?.length) {
    return true;
  }

  const roles = userInfo?.roles ?? [];
  const { permissionSuperRole } = getAdminLayoutsOptions();

  if (permissionSuperRole && roles.includes(permissionSuperRole)) {
    return true;
  }

  return permissions.some(permission => roles.includes(permission));
}

export function hasRoutePermission(routeMeta: Router.Meta | undefined, userInfo?: Api.Auth.UserInfo | null) {
  return hasAnyRoutePermission(routeMeta?.permissions, userInfo);
}

export function hasMatchedRoutePermission(matches: PermissionRouteMatch[], userInfo?: Api.Auth.UserInfo | null) {
  return matches.every(match => hasRoutePermission(match.staticData, userInfo));
}
