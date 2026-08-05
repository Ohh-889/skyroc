import { request } from '../../request';

import type { MenuId, MenuItem, MenuListParams, MenuSavePayload, MenuUpdatePayload } from './types';
import { SYSTEM_MENU_URLS } from './urls';

export function fetchMenuList(params: MenuListParams = {}) {
  return request<MenuItem[]>({
    method: 'get',
    params,
    url: SYSTEM_MENU_URLS.LIST
  });
}

export function fetchMenuDetail(menuId: MenuId) {
  return request<MenuItem>({
    method: 'get',
    url: SYSTEM_MENU_URLS.DETAIL(menuId)
  });
}

export function createMenu(data: MenuSavePayload) {
  return request<MenuItem>({
    data,
    method: 'post',
    url: SYSTEM_MENU_URLS.CREATE
  });
}

export function updateMenu(data: MenuUpdatePayload) {
  return request<MenuItem>({
    data,
    method: 'put',
    url: SYSTEM_MENU_URLS.UPDATE
  });
}

export function deleteMenu(menuId: MenuId) {
  return request<null>({
    method: 'delete',
    url: SYSTEM_MENU_URLS.DELETE(menuId)
  });
}

export function deleteMenusCascade(menuIds: MenuId[]) {
  return request<null>({
    method: 'delete',
    url: SYSTEM_MENU_URLS.CASCADE_DELETE(menuIds)
  });
}
