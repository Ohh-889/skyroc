/** sys_tenant 的主键，不是租户编号 */
export type TenantId = number | string;

/** 0 正常 1 停用 */
export type TenantStatus = '0' | '1';

export type TenantSortField =
  | 'accountCount'
  | 'companyName'
  | 'contactPhone'
  | 'contactUserName'
  | 'createTime'
  | 'domain'
  | 'expireTime'
  | 'id'
  | 'licenseNumber'
  | 'packageId'
  | 'status'
  | 'tenantId';

export interface TenantItem {
  /** 用户数量上限，-1 表示不限制 */
  accountCount: number;
  address: null | string;
  companyName: null | string;
  contactPhone: null | string;
  contactUserName: null | string;
  createTime: null | string;
  domain: null | string;
  /** 留空表示永不过期 */
  expireTime: null | string;
  id: TenantId;
  intro: null | string;
  licenseNumber: null | string;
  packageId: null | TenantId;
  remark: null | string;
  status: TenantStatus;
  /** 租户编号，6 位数字串，前导零有意义，所以是字符串 */
  tenantId: string;
}

export interface TenantListPage {
  current: number;
  records: TenantItem[];
  size: number;
  total: number;
}

export interface TenantListParams {
  accountCount?: number;
  address?: string;
  beginTime?: string;
  companyName?: string;
  contactPhone?: string;
  contactUserName?: string;
  current: number;
  domain?: string;
  endTime?: string;
  intro?: string;
  isAsc?: 'asc' | 'desc';
  licenseNumber?: string;
  orderByColumn?: TenantSortField;
  packageId?: number;
  size: number;
  status?: TenantStatus;
  tenantId?: string;
}

export type TenantExportParams = Omit<TenantListParams, 'current' | 'size'>;

/** 新增和修改共用的企业资料。两边不是包含关系，所以各自继承它而不是互相继承 */
export interface TenantProfilePayload {
  accountCount?: number;
  address?: null | string;
  companyName: string;
  contactPhone: string;
  contactUserName: string;
  domain?: null | string;
  expireTime?: null | string;
  intro?: null | string;
  licenseNumber?: null | string;
  remark?: null | string;
  status?: TenantStatus;
}

/** 租户编号由服务端生成，不收 tenantId。username/password 是开通时那个管理员账号的 */
export interface TenantSavePayload extends TenantProfilePayload {
  packageId: number;
  password: string;
  username: string;
}

/** 不收 tenantId 和 packageId：编号一辈子不变，换套餐要走 syncTenantPackage */
export interface TenantUpdatePayload extends TenantProfilePayload {
  id: number;
}

export interface TenantStatusPayload {
  id: number;
  status: TenantStatus;
}

export interface SyncTenantPackageParams {
  packageId: number;
  tenantId: string;
}
