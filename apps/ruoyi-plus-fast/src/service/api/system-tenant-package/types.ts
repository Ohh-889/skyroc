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

/** 菜单树节点主键。Long 序列化成字符串，所以两种都可能出现。 */
export type TenantPackageTreeKey = number | string;

/** M 目录、C 菜单、F 按钮。 */
export type TenantPackageMenuType = 'C' | 'F' | 'M';

/** 菜单树节点。叶子节点不带 children，后端开了 exclude_none。 */
export interface TenantPackageMenuTreeNode {
  children?: TenantPackageMenuTreeNode[];
  icon: string;
  id: TenantPackageTreeKey;
  label: string;
  menuType: TenantPackageMenuType;
  parentId: TenantPackageTreeKey;
  /** 菜单自身的状态，0 正常 1 停用。 */
  status: TenantPackageStatus;
  /** 菜单自身的显示标记，0 显示 1 隐藏。 */
  visible: string;
  weight: number;
}

export interface TenantPackageMenuTreeResponse {
  /**
   * 该勾中的节点。
   *
   * `menuCheckStrictly` 为 true 时后端只回末级节点，父节点由前端按子节点算出来； 父节点也回过来的话，树会把它下面没授权的兄弟节点一起勾上。
   */
  checkedKeys: TenantPackageTreeKey[];
  /** 整棵树，已经剔除"租户管理"那一支。 */
  menus: TenantPackageMenuTreeNode[];
}
