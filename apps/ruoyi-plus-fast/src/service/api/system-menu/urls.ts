import type { MenuId } from './types';

export const SYSTEM_MENU_URLS = {
  CASCADE_DELETE: (menuIds: MenuId[]) => `/system/menu/cascade/${menuIds.map(String).join(',')}`,
  CREATE: '/system/menu',
  DELETE: (menuId: MenuId) => `/system/menu/${String(menuId)}`,
  DETAIL: (menuId: MenuId) => `/system/menu/${String(menuId)}`,
  LIST: '/system/menu/list',
  UPDATE: '/system/menu'
} as const;
