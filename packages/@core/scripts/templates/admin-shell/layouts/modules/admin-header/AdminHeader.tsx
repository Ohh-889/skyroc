import { LangSwitch } from '@shell/i18n';
import { ThemeSchemaSwitch, useSettingsTheme } from '@shell/theme';
import { FullScreen } from '@shell/ui/antd';
import { DarkModeContainer } from '@shell/ui/compose';
import { useFullscreen } from 'ahooks';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import {
  GLOBAL_HEADER_MENU_ID,
  LAYOUT_MODE_HORIZONTAL,
  LAYOUT_MODE_TOP_HYBRID_HEADER_FIRST,
  LAYOUT_MODE_TOP_HYBRID_SIDEBAR_FIRST,
  LAYOUT_MODE_VERTICAL,
  LAYOUT_MODE_VERTICAL_HYBRID_HEADER_FIRST,
  LAYOUT_MODE_VERTICAL_MIX
} from '../../constant';
import { useAdminLayoutContext } from '../../context';
import MenuToggler from '../../state/menus/MenuToggler';
import { useAdminMenus } from '../../state/menus/use-admin-menus';
import { useAdminState } from '../../state/use-admin-state';
import AdminSearch from '../admin-search/AdminSearch';
import LayoutLogo from '../shared/logo';

import AdminBreadcrumb from './components/Breadcrumb';
import ThemeButton from './components/ThemeButton';

const GlobalHeader = memo(() => {
  const { headerLeftActions, headerMiddleActions, headerRightActions, logo, logoComponent, logoTitle, logoTo } =
    useAdminLayoutContext();

  const [isFullscreen, { toggleFullscreen }] = useFullscreen(document.body);

  const { isActiveFirstLevelMenuHasChildren } = useAdminMenus();

  const { t } = useTranslation();

  const { header, layout, sider } = useSettingsTheme();

  const { isMobile } = useAdminState();

  const siderWidth = sider.width;

  const mode = layout.mode;

  const HEADER_PROPS_CONFIG: Record<UnionKey.ThemeLayoutMode, App.Global.AdminLayout.HeaderProps> = {
    [LAYOUT_MODE_VERTICAL]: {
      showLogo: false,
      showMenu: false,
      showMenuToggler: true
    },
    [LAYOUT_MODE_VERTICAL_MIX]: {
      showLogo: false,
      showMenu: false,
      showMenuToggler: false
    },
    [LAYOUT_MODE_VERTICAL_HYBRID_HEADER_FIRST]: {
      showLogo: !isActiveFirstLevelMenuHasChildren,
      showMenu: true,
      showMenuToggler: false
    },
    [LAYOUT_MODE_HORIZONTAL]: {
      showLogo: true,
      showMenu: true,
      showMenuToggler: false
    },
    [LAYOUT_MODE_TOP_HYBRID_SIDEBAR_FIRST]: {
      showLogo: true,
      showMenu: true,
      showMenuToggler: false
    },
    [LAYOUT_MODE_TOP_HYBRID_HEADER_FIRST]: {
      showLogo: true,
      showMenu: true,
      showMenuToggler: isActiveFirstLevelMenuHasChildren
    }
  };

  const { showLogo, showMenu, showMenuToggler } = HEADER_PROPS_CONFIG[mode];

  const hasLogo = Boolean(logo || logoComponent || logoTitle);

  return (
    <DarkModeContainer className="h-full flex-y-center px-12px shadow-header">
      {showLogo && hasLogo ? (
        <LayoutLogo
          logo={logo}
          logoComponent={logoComponent}
          style={{ width: `${siderWidth}px` }}
          title={logoTitle}
          to={logoTo}
        />
      ) : null}

      {showMenuToggler && <MenuToggler />}

      <div className="h-full flex-y-center flex-1-hidden" id={GLOBAL_HEADER_MENU_ID}>
        {!isMobile && !showMenu && <AdminBreadcrumb />}
      </div>

      <div className="h-full flex-y-center justify-end">

        {headerLeftActions}

        <AdminSearch />


        {!isMobile && (
          <FullScreen
            className="px-12px"
            enterTooltip={t('icon.fullscreen')}
            exitTooltip={t('icon.fullscreenExit')}
            full={isFullscreen}
            toggleFullscreen={toggleFullscreen}
          />
        )}

        <LangSwitch className="px-12px" visible={header.multilingual.visible} />

        {headerMiddleActions}

        <ThemeSchemaSwitch className="px-12px" tooltipContent={t('icon.themeSchema')} />

        <ThemeButton />

        {headerRightActions}
      </div>
    </DarkModeContainer>
  );
});

export default GlobalHeader;
