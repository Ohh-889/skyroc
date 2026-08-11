import { request } from '../../request';

import type {
  TenantPackageExportParams,
  TenantPackageId,
  TenantPackageItem,
  TenantPackageListPage,
  TenantPackageListParams,
  TenantPackageOption,
  TenantPackageSavePayload,
  TenantPackageStatusPayload,
  TenantPackageUpdatePayload
} from './types';
import { SYSTEM_TENANT_PACKAGE_URLS } from './urls';

export function fetchTenantPackageList(params: TenantPackageListParams) {
  return request<TenantPackageListPage>({ method: 'get', params, url: SYSTEM_TENANT_PACKAGE_URLS.LIST });
}

/** 新增租户时那个套餐下拉框，只给状态正常的 */
export function fetchTenantPackageOptions() {
  return request<TenantPackageOption[]>({ method: 'get', url: SYSTEM_TENANT_PACKAGE_URLS.SELECT_LIST });
}

export function fetchTenantPackageDetail(id: TenantPackageId) {
  return request<TenantPackageItem>({ method: 'get', url: SYSTEM_TENANT_PACKAGE_URLS.DETAIL(id) });
}

/** 导出的是筛选条件命中的全部数据，所以不收分页参数 */
export function exportTenantPackages(params: TenantPackageExportParams) {
  return request<Blob, 'blob'>({
    method: 'post',
    params,
    responseType: 'blob',
    url: SYSTEM_TENANT_PACKAGE_URLS.EXPORT
  });
}

export function createTenantPackage(data: TenantPackageSavePayload) {
  return request<TenantPackageItem>({ data, method: 'post', url: SYSTEM_TENANT_PACKAGE_URLS.CREATE });
}

/** 改完菜单不会自动重算已挂在它上面的租户，那要再调一次 syncTenantPackage */
export function updateTenantPackage(data: TenantPackageUpdatePayload) {
  return request<TenantPackageItem>({ data, method: 'put', url: SYSTEM_TENANT_PACKAGE_URLS.UPDATE });
}

/** 只收 packageId 和 status，改不了名称和菜单 */
export function updateTenantPackageStatus(data: TenantPackageStatusPayload) {
  return request<TenantPackageItem>({ data, method: 'put', url: SYSTEM_TENANT_PACKAGE_URLS.CHANGE_STATUS });
}

/** 一次最多 100 个。有一条还挂着租户，整批都不删 */
export function deleteTenantPackages(ids: TenantPackageId[]) {
  return request<null>({ method: 'delete', url: SYSTEM_TENANT_PACKAGE_URLS.DELETE(ids) });
}
