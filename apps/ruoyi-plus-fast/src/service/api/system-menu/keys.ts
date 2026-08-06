import type { MenuListParams } from './types';

export const SYSTEM_MENU_QUERY_KEYS = {
  ALL: ['system-menu'] as const,
  DETAIL: (menuId: number | string) => ['system-menu', 'detail', String(menuId)] as const,
  LISTS: ['system-menu', 'list'] as const,
  LIST: (params: MenuListParams) => ['system-menu', 'list', params] as const
} as const;

export const SYSTEM_MENU_MUTATION_KEYS = {
  CREATE: ['system-menu', 'create'] as const,
  DELETE: ['system-menu', 'delete'] as const,
  DELETE_CASCADE: ['system-menu', 'delete-cascade'] as const,
  UPDATE: ['system-menu', 'update'] as const
} as const;
