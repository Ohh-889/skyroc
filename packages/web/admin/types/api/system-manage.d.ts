// oxlint-disable unicorn/require-module-specifiers
/**
 * 命名空间 Api.SystemManage
 *
 * 后端 API 模块：系统管理模块
 */
declare global {
  namespace Api.SystemManage {
    /** 将查询表单字段转成可选且允许为空的接口查询参数。 */
    type NullableSearchRecord<T> = {
      [K in keyof T]?: T[K] | null;
    };

    /** 通用搜索参数 */
    type CommonSearchParams = Pick<Api.Common.PaginatingCommonParams, 'current' | 'size'>;

    /** 角色 */
    type Role = Api.Common.CommonRecord<{
      /** 角色编码 */
      roleCode: string;
      /** 角色描述 */
      roleDesc: string;
      /** 角色名称 */
      roleName: string;
    }>;

    /** 角色搜索参数 */
    type RoleSearchParams = NullableSearchRecord<Pick<Role, 'roleCode' | 'roleName' | 'status'> & CommonSearchParams>;

    /** 角色列表 */
    type RoleList = Api.Common.PaginatingQueryRecord<Role>;

    /** 所有角色（简化版） */
    type AllRole = Pick<Role, 'id' | 'roleCode' | 'roleName'>;

    /**
     * 用户性别
     *
     * - "1": 男
     * - "2": 女
     */
    type UserGender = '1' | '2';

    /** 用户 */
    type User = Api.Common.CommonRecord<{
      /** 用户昵称 */
      nickName: string;
      /** 用户邮箱 */
      userEmail: string;
      /** 用户性别 */
      userGender: UserGender | null;
      /** 用户名 */
      userName: string;
      /** 用户手机号 */
      userPhone: string;
      /** 用户角色编码集合 */
      userRoles: string[];
    }>;

    /** 用户搜索参数 */
    type UserSearchParams = NullableSearchRecord<
      Pick<User, 'nickName' | 'status' | 'userEmail' | 'userGender' | 'userName' | 'userPhone'> & CommonSearchParams
    >;

    /** 用户列表 */
    type UserList = Api.Common.PaginatingQueryRecord<User>;

    /**
     * 菜单类型
     *
     * - "1": 目录
     * - "2": 菜单
     */
    type MenuType = '1' | '2';

    /** 菜单按钮 */
    type MenuButton = {
      /**
       * 按钮编码
       *
       * 可用于控制按钮权限
       */
      code: string;
      /** 按钮描述 */
      desc: string;
    };

    /** 菜单路由参数 */
    type MenuRouteQuery = {
      /** 参数 Key */
      key: string;
      /** 参数 Value */
      value: string;
    };

    /** 菜单的路由属性 */
    interface MenuPropsOfRoute {
      /** 高亮的菜单路径 */
      activeMenu?: Router.RoutePath | null;
      /** 是否为常量路由 */
      constant?: boolean | null;
      /** 固定在页签中的序号 */
      fixedIndexInTab?: number | null;
      /** 是否隐藏菜单 */
      hideInMenu?: boolean | null;
      /** 外链地址 */
      href?: string | null;
      /** 国际化键 */
      i18nKey?: I18n.I18nKey | null;
      /** 是否缓存路由 */
      keepAlive?: boolean | null;
      /** 是否支持多页签 */
      multiTab?: boolean | null;
      /** 菜单排序 */
      order?: number | null;
      /** 路由参数 */
      query?: MenuRouteQuery[] | null;
    }

    /** 菜单 */
    type Menu = Api.Common.CommonRecord<{
      /** 按钮列表 */
      buttons?: MenuButton[] | null;
      /** 子菜单 */
      children?: Menu[] | null;
      /** 组件路径 */
      component?: string;
      /** 图标名称（iconify 图标名或本地图标名） */
      icon: string;
      /** 菜单名称 */
      menuName: string;
      /** 菜单类型 */
      menuType: MenuType;
      /** 父级菜单 ID */
      parentId: number;
      /** 路由名称 */
      routeName: string;
      /** 路由路径 */
      routePath: string;
    }> &
      MenuPropsOfRoute;

    /** 菜单列表 */
    type MenuList = Api.Common.PaginatingQueryRecord<Menu>;

    /** 菜单树 */
    type MenuTree = {
      /** 子菜单树 */
      children?: MenuTree[];
      /** 菜单 ID */
      id: number;
      /** 菜单标签 */
      label: string;
      /** 父级菜单 ID */
      pId: number;
    };
  }
}

export {};
