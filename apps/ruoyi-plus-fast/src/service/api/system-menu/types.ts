export type MenuId = number | string;

export type MenuType = 'C' | 'F' | 'M';

export type MenuStatus = '0' | '1';

export type MenuVisibility = '0' | '1';

export type MenuFrameMode = '0' | '1';

export type MenuCacheMode = '0' | '1';

export interface MenuListParams {
  menuName?: string;
  menuType?: MenuType;
  parentId?: MenuId;
  status?: MenuStatus;
  visible?: MenuVisibility;
}

export interface MenuItem {
  children: MenuItem[];
  component: string | null;
  createDept: MenuId | null;
  createTime: string | null;
  icon: string;
  isCache: MenuCacheMode;
  isFrame: MenuFrameMode;
  menuId: MenuId;
  menuName: string;
  menuType: MenuType;
  orderNum: number;
  parentId: MenuId;
  path: string;
  perms: string | null;
  queryParam: string | null;
  remark: string;
  status: MenuStatus;
  visible: MenuVisibility;
}

export interface MenuSavePayload {
  component: string | null;
  icon: string;
  isCache: MenuCacheMode;
  isFrame: MenuFrameMode;
  menuName: string;
  menuType: MenuType;
  orderNum: number;
  parentId: MenuId;
  path: string;
  perms: string | null;
  queryParam: string | null;
  remark: string;
  status: MenuStatus;
  visible: MenuVisibility;
}

export interface MenuUpdatePayload extends MenuSavePayload {
  menuId: MenuId;
}
