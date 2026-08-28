import { useSettingsTheme } from '@shell/theme';
import { DarkModeContainer } from '@shell/ui/compose';
import { memo } from 'react';

import {
  GLOBAL_SIDER_MENU_ID,
  LAYOUT_MODE_TOP_HYBRID_HEADER_FIRST,
  LAYOUT_MODE_TOP_HYBRID_SIDEBAR_FIRST,
  LAYOUT_MODE_VERTICAL
} from '../constant';
import { useAdminLayoutContext } from '../context';
import { useAdminState } from '../state/use-admin-state';
import LayoutLogo from './shared/logo';

const GlobalSider = memo(() => {
  const { logo, logoComponent, logoTitle, logoTo } = useAdminLayoutContext();
  const { darkMode, header, layout, sider } = useSettingsTheme();
  const { siderCollapse } = useAdminState();

  const isTopHybridSidebarFirst = layout.mode === LAYOUT_MODE_TOP_HYBRID_SIDEBAR_FIRST;
  const isTopHybridHeaderFirst = layout.mode === LAYOUT_MODE_TOP_HYBRID_HEADER_FIRST;

  const darkMenu = !darkMode && !isTopHybridSidebarFirst && !isTopHybridHeaderFirst && sider.inverted;

  const showLogo = layout.mode === LAYOUT_MODE_VERTICAL;

  const headerHeight = header.height;

  const menuWrapperClass = showLogo ? 'flex-1-hidden' : 'h-full';

  const hasLogo = Boolean(logo || logoComponent || logoTitle);

  return (
    <DarkModeContainer
      className="size-full flex-col-stretch shadow-sider"
      inverted={darkMenu}
    >
      {showLogo && hasLogo ? (
        <LayoutLogo
          logo={logo}
          logoComponent={logoComponent}
          showTitle={!siderCollapse}
          style={{ height: `${headerHeight}px` }}
          title={logoTitle}
          to={logoTo}
        />
      ) : null}
      <div
        className={menuWrapperClass}
        id={GLOBAL_SIDER_MENU_ID}
      />
    </DarkModeContainer>
  );
});

export default GlobalSider;
