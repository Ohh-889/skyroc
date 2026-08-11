import type { Dayjs } from 'dayjs';

import type { TenantPackageListParams, TenantPackageStatus } from '@/service/api/system-tenant-package';

export interface TenantPackageTableParams extends TenantPackageListParams {
  /** 查询表单使用的创建时间范围，提交前拆成 beginTime / endTime。 */
  createdRange?: [Dayjs | null, Dayjs | null] | null;
}

export function hasTenantPackageFilters(params: Partial<TenantPackageTableParams>) {
  return Boolean(params.createdRange || params.packageName || params.status);
}

export const TENANT_PACKAGE_STATUS_OPTIONS = [
  { label: '正常', value: '0' },
  { label: '停用', value: '1' }
] satisfies Array<{ label: string; value: TenantPackageStatus }>;

export function formatTenantPackageStatus(status: TenantPackageStatus) {
  return status === '0' ? '正常' : '停用';
}

/** 一次最多删 100 个，超了后端直接 422。 */
export const TENANT_PACKAGE_DELETE_LIMIT = 100;

/** 和后端建表时的列宽一致。 */
export const TENANT_PACKAGE_FIELD_LIMITS = {
  packageName: 20,
  remark: 200
} as const;

/** 一个套餐最多关联多少个菜单。 */
const MAX_PACKAGE_MENU_IDS = 500;

/** Menu_ids 那一列的宽度。真正的上限是这个，不是个数。 */
const PACKAGE_MENU_IDS_MAX_LENGTH = 3000;

/**
 * 菜单勾太多时提前拦下来。
 *
 * 后端按拼接成逗号串之后的长度算，所以这里也按串长算，不按个数猜： 放过去的话 MySQL 非严格模式会静默截断，接口回"保存成功"而套餐里少了几个菜单。
 */
export function resolvePackageMenuIdsError(menuIds: number[]) {
  if (menuIds.length > MAX_PACKAGE_MENU_IDS) {
    return `一个套餐最多关联 ${MAX_PACKAGE_MENU_IDS} 个菜单，当前已选 ${menuIds.length} 个。`;
  }

  const encodedLength = menuIds.join(',').length;

  if (encodedLength > PACKAGE_MENU_IDS_MAX_LENGTH) {
    return `所选菜单编码后有 ${encodedLength} 个字符，超过了 ${PACKAGE_MENU_IDS_MAX_LENGTH} 的上限，请减少选择。`;
  }

  return null;
}

/** 菜单范围列只给数量：逐个列 ID 既占地方也没人看得懂。 */
export function formatPackageMenuScope(menuIds: number[] | null | undefined) {
  if (!menuIds?.length) return '未授权菜单';

  return `已选 ${menuIds.length} 项`;
}
