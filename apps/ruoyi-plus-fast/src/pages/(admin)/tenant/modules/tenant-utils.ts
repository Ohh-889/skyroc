import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';

import type { TenantItem, TenantListParams, TenantStatus } from '@/service/api/system-tenant';
import type { TenantPackageOption } from '@/service/api/system-tenant-package';

export interface TenantTableParams extends TenantListParams {
  /** 查询表单使用的创建时间范围，提交前拆成 beginTime / endTime。 */
  createdRange?: [Dayjs | null, Dayjs | null] | null;
}

export function hasTenantFilters(params: Partial<TenantTableParams>) {
  return Boolean(
    params.companyName || params.contactUserName || params.status || params.tenantId || hasAdvancedTenantFilters(params)
  );
}

/** 低频筛选项默认收起；已经在用的时候必须展开，否则筛掉了数据却看不见条件。 */
export function hasAdvancedTenantFilters(params: Partial<TenantTableParams>) {
  return Boolean(
    params.contactPhone || params.createdRange || params.domain || params.licenseNumber || params.packageId
  );
}

export const TENANT_STATUS_OPTIONS = [
  { label: '正常', value: '0' },
  { label: '停用', value: '1' }
] satisfies Array<{ label: string; value: TenantStatus }>;

export function formatTenantStatus(status: TenantStatus) {
  return status === '0' ? '正常' : '停用';
}

/** 管理租户那一行：主键 1，编号 000000。 */
const MANAGEMENT_TENANT_PK = '1';
const MANAGEMENT_TENANT_ID = '000000';

/**
 * 管理租户是平台基座，改它、停它、删它后端一律 403。
 *
 * 两个条件都判是因为后端也是两个都挡，只认主键的话换个部署就漏了。
 */
export function isManagementTenant(tenant: Pick<TenantItem, 'id' | 'tenantId'>) {
  return String(tenant.id) === MANAGEMENT_TENANT_PK || tenant.tenantId === MANAGEMENT_TENANT_ID;
}

/** 用户数量不限。后端用 -1 表示，不是 null，判断上限前要先挡掉这个值。 */
export const UNLIMITED_ACCOUNTS = -1;

export function formatAccountCount(accountCount: number) {
  return accountCount === UNLIMITED_ACCOUNTS ? '不限制' : `${accountCount} 人`;
}

/** 一次最多删 100 个，超了后端直接 422，不静默截断。 */
export const TENANT_DELETE_LIMIT = 100;

/** 和后端建表时的列宽一致，先在字段级拦下来，不用等 422。 */
export const TENANT_FIELD_LIMITS = {
  address: 200,
  companyName: 30,
  contactPhone: 20,
  contactUserName: 20,
  domain: 200,
  intro: 200,
  licenseNumber: 30,
  passwordMax: 20,
  passwordMin: 5,
  remark: 200,
  tenantId: 6,
  usernameMax: 30,
  usernameMin: 2
} as const;

/** 到期前多少天开始提示续费。 */
const EXPIRY_WARNING_DAYS = 30;

export type TenantExpiryLevel = 'expired' | 'never' | 'normal' | 'warning';

export interface TenantExpiry {
  /** 到期日；永不过期时为空。 */
  date: string;
  /** 紧迫程度，决定文案和配色。 */
  level: TenantExpiryLevel;
  /** 剩余时间的说明，和颜色一起表达，不只靠颜色。 */
  note: string;
}

/** 有效期留空表示永不过期，不是"1970 年"，所以空值单独一档。 */
export function resolveTenantExpiry(expireTime: null | string): TenantExpiry {
  if (!expireTime) return { date: '', level: 'never', note: '永不过期' };

  const expiry = dayjs(expireTime);

  if (!expiry.isValid()) return { date: expireTime, level: 'normal', note: '' };

  const date = expiry.format('YYYY-MM-DD');
  const days = expiry.diff(dayjs(), 'day');

  if (expiry.isBefore(dayjs())) return { date, level: 'expired', note: '已过期' };
  if (days <= EXPIRY_WARNING_DAYS)
    return { date, level: 'warning', note: days === 0 ? '今天到期' : `${days} 天后到期` };

  return { date, level: 'normal', note: `剩余 ${days} 天` };
}

/** 到期提示既要有颜色也要有文字，配色单独抽出来，列表和详情用同一套。 */
export function resolveTenantExpiryColor(level: TenantExpiryLevel) {
  if (level === 'expired') return 'text-error';
  if (level === 'warning') return 'text-warning';

  return undefined;
}

/**
 * 套餐下拉只返回状态正常的套餐，停用套餐在这里映射不到名称。
 *
 * 映射不到时显示编号而不是空白：租户确实挂着一个套餐，空白会被读成"没有套餐"。
 */
export function resolveTenantPackageName(
  options: TenantPackageOption[],
  packageId: null | number | string | undefined
) {
  if (packageId === null || packageId === undefined || packageId === '') return '';

  const matched = options.find(option => String(option.packageId) === String(packageId));

  return matched?.packageName || `套餐 #${packageId}`;
}

/** 列表里只到分钟：秒对运营判断没有意义，还白占列宽。 */
export function formatTenantMinute(value: null | string) {
  if (!value) return '';

  const parsed = dayjs(value);

  return parsed.isValid() ? parsed.format('YYYY-MM-DD HH:mm') : value;
}
