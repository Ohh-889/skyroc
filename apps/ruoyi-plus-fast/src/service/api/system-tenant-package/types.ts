export type TenantPackageId = number | string;

/** 0 正常 1 停用 */
export type TenantPackageStatus = '0' | '1';

export type TenantPackageSortField = 'createTime' | 'packageId' | 'packageName' | 'status';

export interface TenantPackageItem {
  createTime: null | string;
  /** 菜单树选择项是否关联显示 */
  menuCheckStrictly: boolean;
  /** 后端回的是数字数组，不是 RuoYi 那种逗号串 */
  menuIds: number[];
  packageId: TenantPackageId;
  packageName: null | string;
  remark: null | string;
  status: TenantPackageStatus;
}

/** 下拉框里的一项，只有编号和名称，没有 menuIds */
export interface TenantPackageOption {
  packageId: TenantPackageId;
  packageName: null | string;
}

export interface TenantPackageListPage {
  current: number;
  records: TenantPackageItem[];
  size: number;
  total: number;
}

export interface TenantPackageListParams {
  beginTime?: string;
  current: number;
  endTime?: string;
  isAsc?: 'asc' | 'desc';
  orderByColumn?: TenantPackageSortField;
  packageName?: string;
  size: number;
  status?: TenantPackageStatus;
}

export type TenantPackageExportParams = Omit<TenantPackageListParams, 'current' | 'size'>;

export interface TenantPackageSavePayload {
  menuCheckStrictly?: boolean;
  /** 最多 500 个，且拼接成串后不能超过 3000 字符 */
  menuIds?: number[];
  packageName: string;
  remark?: null | string;
  status?: TenantPackageStatus;
}

export interface TenantPackageUpdatePayload extends TenantPackageSavePayload {
  packageId: number;
}

export interface TenantPackageStatusPayload {
  packageId: number;
  status: TenantPackageStatus;
}
