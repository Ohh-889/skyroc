import { createContext, useContext } from 'react';
import type { CSSProperties, ReactNode } from 'react';

import { getDefaultMenuCategoryKey } from './setup';

export type AdminLayoutLogoComponent = ((style: CSSProperties) => ReactNode) | ReactNode;

export interface AdminLayoutLogoProps {
  /** Logo wrapper class supplied by each layout position. */
  className?: string;
  /** Brand mark rendered before the title. */
  logo?: ReactNode;
  /** Whether the title should be visible in the current layout position. */
  showTitle?: boolean;
  /** Logo wrapper style supplied by each layout position. */
  style?: CSSProperties;
  /** Brand title rendered by the default logo component. */
  title?: ReactNode;
  /** Route path used when clicking the logo. */
  to?: Router.RoutePath;
}

export interface AdminLayoutSlots {
  /** 主内容区域，默认使用 TanStack Router 的 Outlet。 */
  content?: ReactNode;
  /** 页脚区域。 */
  footer?: ReactNode;
  /** 头部操作区左侧插槽，位于搜索和全屏按钮之间。 */
  headerLeftActions?: ReactNode;
  /** 头部操作区中间插槽，位于语言切换和主题按钮之间。 */
  headerMiddleActions?: ReactNode;
  /** 头部操作区右侧插槽，位于所有内置操作之后。 */
  headerRightActions?: ReactNode;
  /** 品牌图标，由默认 Logo 组件渲染。 */
  logo?: ReactNode;
  /** 自定义完整 Logo 插槽，可直接传节点或通过布局样式渲染。 */
  logoComponent?: AdminLayoutLogoComponent;
  /** 品牌标题，由默认 Logo 组件渲染。 */
  logoTitle?: ReactNode;
  /** 点击 Logo 时跳转的路径，默认使用布局配置的 defaultHome。 */
  logoTo?: Router.RoutePath;
}

export interface AdminLayoutContextValue extends AdminLayoutSlots {
  /** 当前布局使用的菜单分类。 */
  categoryKey: string;
}

export interface AdminLayoutProviderProps extends AdminLayoutContextValue {
  /** 布局子节点。 */
  children: ReactNode;
}

const AdminLayoutContext = createContext<AdminLayoutContextValue | null>(null);

export const AdminLayoutProvider = (props: AdminLayoutProviderProps) => {
  const {
    categoryKey,
    children,
    content,
    footer,
    headerLeftActions,
    headerMiddleActions,
    headerRightActions,
    logo,
    logoComponent,
    logoTitle,
    logoTo
  } = props;

  return (
    <AdminLayoutContext
      value={{
        categoryKey,
        content,
        footer,
        headerLeftActions,
        headerMiddleActions,
        headerRightActions,
        logo,
        logoComponent,
        logoTitle,
        logoTo
      }}
    >
      {children}
    </AdminLayoutContext>
  );
};

export function useAdminLayoutContext() {
  const context = useContext(AdminLayoutContext);

  if (context) {
    return context;
  }

  return {
    categoryKey: getDefaultMenuCategoryKey()
  };
}
