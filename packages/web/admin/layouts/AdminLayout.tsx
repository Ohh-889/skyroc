import { useSettingsTheme } from '@shell/theme';
import { Suspense, lazy } from 'react';
import type { LayoutMode } from './materials';
import { AdminLayout as AdminLayoutComponent, LAYOUT_SCROLL_EL_ID } from './materials';

import {
  LAYOUT_MODE_HORIZONTAL,
  LAYOUT_MODE_TOP_HYBRID_HEADER_FIRST,
  LAYOUT_MODE_TOP_HYBRID_SIDEBAR_FIRST,
  LAYOUT_MODE_VERTICAL,
  LAYOUT_MODE_VERTICAL_HYBRID_HEADER_FIRST,
  LAYOUT_MODE_VERTICAL_MIX,
  VERTICAL_LAYOUT_MODES
} from './constant';
import type { AdminLayoutSlots } from './context';
import { AdminLayoutProvider, useAdminLayoutContext } from './context';
import AdminHeader from './modules/admin-header/AdminHeader';
import AdminMenu from './modules/admin-menu/AdminMenu';
import AdminTab from './modules/admin-tab/AdminTab';
import GlobalContent from './modules/AdminContent';
import GlobalSider from './modules/AdminSider';
import { getDefaultMenuCategoryKey } from './setup';
import { useAdminMenus } from './state/menus/use-admin-menus';
import { useAdminState } from './state/use-admin-state';

const ThemeDrawer = lazy(() => import('./modules/theme-drawer/ThemeDrawer'));

const AdminEffect = lazy(() => import('./state/AdminEffect'));

export interface AdminLayoutProps extends AdminLayoutSlots {
  /** 当前布局使用的菜单分类。 */
  categoryKey?: string;
}

const AdminLayoutContent = () => {
  const { contentXScrollable, fullContent, isMobile, mixSiderFixed, siderCollapse, toggleSiderCollapse } =
    useAdminState();
  const { footer: footerSlot } = useAdminLayoutContext();

  const { fixedHeaderAndTab, footer: themeFooter, header, layout, sider, tab } = useSettingsTheme();

  const { childLevelMenus, isActiveFirstLevelMenuHasChildren, secondLevelMenus } = useAdminMenus();

  const layoutMode = VERTICAL_LAYOUT_MODES.includes(layout.mode) ? LAYOUT_MODE_VERTICAL : LAYOUT_MODE_HORIZONTAL;

  const isTopHybridHeaderFirst = layout.mode === LAYOUT_MODE_TOP_HYBRID_HEADER_FIRST;

  const isVerticalHybridHeaderFirst = layout.mode === LAYOUT_MODE_VERTICAL_HYBRID_HEADER_FIRST;

  const isTopHybridSidebarFirst = layout.mode === LAYOUT_MODE_TOP_HYBRID_SIDEBAR_FIRST;

  const isVerticalMix = layout.mode === LAYOUT_MODE_VERTICAL_MIX;

  const siderVisible = layout.mode !== LAYOUT_MODE_HORIZONTAL;

  const siderWidth = getSiderAndCollapsedWidth(false);

  const siderCollapsedWidth = getSiderAndCollapsedWidth(true);

  function getSiderAndCollapsedWidth(isCollapsed: boolean) {
    const { collapsedWidth, mixChildMenuWidth, mixCollapsedWidth, mixWidth: themeMixWidth, width: themeWidth } = sider;

    const width = isCollapsed ? collapsedWidth : themeWidth;
    const mixWidth = isCollapsed ? mixCollapsedWidth : themeMixWidth;

    if (isTopHybridHeaderFirst) {
      return isActiveFirstLevelMenuHasChildren ? width : 0;
    }

    if (isVerticalHybridHeaderFirst && !isActiveFirstLevelMenuHasChildren) {
      return 0;
    }

    const isMixMode = isVerticalMix || isTopHybridSidebarFirst || isVerticalHybridHeaderFirst;
    let finalWidth = isMixMode ? mixWidth : width;

    if (isVerticalMix && mixSiderFixed && secondLevelMenus.length) {
      finalWidth += mixChildMenuWidth;
    }

    if (isVerticalHybridHeaderFirst && mixSiderFixed && childLevelMenus.length) {
      finalWidth += mixChildMenuWidth;
    }

    return finalWidth;
  }

  return (
    <AdminLayoutComponent
      contentClass={contentXScrollable ? 'overflow-x-hidden' : ''}
      fixedFooter={themeFooter.fixed}
      fixedTop={fixedHeaderAndTab}
      Footer={footerSlot}
      footerHeight={themeFooter.height}
      footerVisible={Boolean(footerSlot) && themeFooter.visible}
      fullContent={fullContent}
      Header={<AdminHeader />}
      headerHeight={header.height}
      isMobile={isMobile}
      mode={layoutMode as LayoutMode}
      rightFooter={themeFooter.right}
      scrollElId={LAYOUT_SCROLL_EL_ID}
      scrollMode={layout.scrollMode}
      Sider={<GlobalSider />}
      siderCollapse={siderCollapse}
      siderCollapsedWidth={siderCollapsedWidth}
      siderVisible={siderVisible}
      siderWidth={siderWidth}
      Tab={<AdminTab />}
      tabHeight={tab.height}
      tabVisible={tab.visible}
      updateSiderCollapse={toggleSiderCollapse}
    >
      <GlobalContent />

      <AdminMenu />

      <Suspense fallback={null}>
        <ThemeDrawer />
      </Suspense>

      <Suspense fallback={null}>
        <AdminEffect />
      </Suspense>
    </AdminLayoutComponent>
  );
};

const AdminLayout = (props: AdminLayoutProps) => {
  const {
    categoryKey = getDefaultMenuCategoryKey(),
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
    <AdminLayoutProvider
      categoryKey={categoryKey}
      content={content}
      footer={footer}
      headerLeftActions={headerLeftActions}
      headerMiddleActions={headerMiddleActions}
      headerRightActions={headerRightActions}
      logo={logo}
      logoComponent={logoComponent}
      logoTitle={logoTitle}
      logoTo={logoTo}
    >
      <AdminLayoutContent />
    </AdminLayoutProvider>
  );
};

export default AdminLayout;
