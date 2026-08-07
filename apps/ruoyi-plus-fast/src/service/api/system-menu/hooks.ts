import { useMutation, useQuery } from '@tanstack/react-query';

import { createMenu, deleteMenu, deleteMenusCascade, fetchMenuDetail, fetchMenuList, updateMenu } from './api';
import { SYSTEM_MENU_MUTATION_KEYS, SYSTEM_MENU_QUERY_KEYS } from './keys';
import type { MenuId, MenuListParams, MenuSavePayload, MenuUpdatePayload } from './types';

export function useMenuListQuery(params: MenuListParams = {}) {
  return useQuery({
    queryFn: () => fetchMenuList(params),
    queryKey: SYSTEM_MENU_QUERY_KEYS.LIST(params)
  });
}

export function useMenuDetailQuery(menuId: MenuId | undefined) {
  return useQuery({
    enabled: Boolean(menuId),
    queryFn: () => fetchMenuDetail(menuId as MenuId),
    queryKey: SYSTEM_MENU_QUERY_KEYS.DETAIL(menuId ?? 'none')
  });
}

export function useCreateMenuMutation() {
  return useMutation({
    mutationFn: (data: MenuSavePayload) => createMenu(data),
    mutationKey: SYSTEM_MENU_MUTATION_KEYS.CREATE
  });
}

export function useUpdateMenuMutation() {
  return useMutation({
    mutationFn: (data: MenuUpdatePayload) => updateMenu(data),
    mutationKey: SYSTEM_MENU_MUTATION_KEYS.UPDATE
  });
}

export function useDeleteMenuMutation() {
  return useMutation({
    mutationFn: (menuId: MenuId) => deleteMenu(menuId),
    mutationKey: SYSTEM_MENU_MUTATION_KEYS.DELETE
  });
}

export function useDeleteMenusCascadeMutation() {
  return useMutation({
    mutationFn: (menuIds: MenuId[]) => deleteMenusCascade(menuIds),
    mutationKey: SYSTEM_MENU_MUTATION_KEYS.DELETE_CASCADE
  });
}
