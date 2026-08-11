import { request } from '../../request';

import type {
  SyncTenantPackageParams,
  TenantExportParams,
  TenantId,
  TenantItem,
  TenantListPage,
  TenantListParams,
  TenantSavePayload,
  TenantStatusPayload,
  TenantUpdatePayload
} from './types';
import { SYSTEM_TENANT_URLS } from './urls';

export function fetchTenantList(params: TenantListParams) {
  return request<TenantListPage>({ method: 'get', params, url: SYSTEM_TENANT_URLS.LIST });
}

export function fetchTenantDetail(id: TenantId) {
  return request<TenantItem>({ method: 'get', url: SYSTEM_TENANT_URLS.DETAIL(id) });
}

/** 导出的是筛选条件命中的全部数据，所以不收分页参数 */
export function exportTenants(params: TenantExportParams) {
  return request<Blob, 'blob'>({ method: 'post', params, responseType: 'blob', url: SYSTEM_TENANT_URLS.EXPORT });
}

// encrypt 对应后端 create_tenant 上的 @api_encrypt()，两边必须同时开或同时关：
// 请求体里带着新租户管理员的明文密码
export function createTenant(data: TenantSavePayload) {
  return request<TenantItem>({ data, encrypt: true, method: 'post', url: SYSTEM_TENANT_URLS.CREATE });
}

export function updateTenant(data: TenantUpdatePayload) {
  return request<TenantItem>({ data, method: 'put', url: SYSTEM_TENANT_URLS.UPDATE });
}

export function updateTenantStatus(data: TenantStatusPayload) {
  return request<TenantItem>({ data, method: 'put', url: SYSTEM_TENANT_URLS.CHANGE_STATUS });
}

/** 一次最多 100 个，超了后端直接 422，不静默截断 */
export function deleteTenants(ids: TenantId[]) {
  return request<null>({ method: 'delete', url: SYSTEM_TENANT_URLS.DELETE(ids) });
}

/** 把自己的数据视角切到这家租户，一直有效到显式清除，没有过期时间 */
export function switchDynamicTenant(tenantId: string) {
  return request<null>({ method: 'get', url: SYSTEM_TENANT_URLS.SWITCH_DYNAMIC(tenantId) });
}

/** 切回自己的租户。没切过也照常成功 */
export function clearDynamicTenant() {
  return request<null>({ method: 'get', url: SYSTEM_TENANT_URLS.CLEAR_DYNAMIC });
}

/** 套餐内容变了之后，把这家租户所有角色的菜单授权重算一遍 */
export function syncTenantPackage(params: SyncTenantPackageParams) {
  return request<null>({ method: 'get', params, url: SYSTEM_TENANT_URLS.SYNC_PACKAGE });
}

export function syncTenantDict() {
  return request<null>({ method: 'get', url: SYSTEM_TENANT_URLS.SYNC_DICT });
}

export function syncTenantConfig() {
  return request<null>({ method: 'get', url: SYSTEM_TENANT_URLS.SYNC_CONFIG });
}
