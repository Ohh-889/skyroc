import { useSettingsTheme } from '@shell/theme';
import { PinToggler } from '@shell/ui/antd';
import { DarkModeContainer } from '@shell/ui/compose';
import classNames from 'clsx';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { GLOBAL_SIDER_MENU_SELECTOR } from '../../../constant';
import { useAdminLayoutContext } from '../../../context';
import { useAdminMenus } from '../../../state/menus/use-admin-menus';
import { useAdminState } from '../../../state/use-admin-state';
import LayoutLogo from '../../shared/logo';
import FirstLevelMenu from '../components/FirstLevelMenu';
import MenuPortal from '../components/MenuPortal';
import VerticalMenu from '../components/VerticalMenu';
import { FirstLevelMenuMode } from '../enum';

interface VerticalMixProps {
  /** 混合菜单层级模式。 */
  mode?: FirstLevelMenuMode;
}

const VerticalMix = memo((props: VerticalMixProps) => {
  const { mode = FirstLevelMenuMode.All } = props;

  const { t } = useTranslation();

  const {
    activeFirstLevelMenuKey,
    activeSecondLevelMenuKey,
    changeActiveFirstLevelMenuKey,
    childLevelMenus,
    drawerVisible,
    menus,
    secondLevelMenus,
    setDrawerVisible
  } = useAdminMenus();

  const { darkMode, header, sider } = useSettingsTheme();

  const { mixSiderFixed, siderCollapse, toggleMixSiderFixed } = useAdminState();

  const { logo, logoComponent, logoTitle, logoTo } = useAdminLayoutContext();

  const siderInverted = !darkMode && sider.inverted;

  const isFirst = mode === FirstLevelMenuMode.All;

  const titleSource = isFirst ? menus : secondLevelMenus;

  const titleKey = isFirst ? activeFirstLevelMenuKey : activeSecondLevelMenuKey;

  const activeMenuLabel = titleSource.find(item => item.key === titleKey)?.label;

  const hasMenus = isFirst
    ? secondLevelMenus && secondLevelMenus.length > 0
    : childLevelMenus && childLevelMenus.length > 0;

  const showDrawer = hasMenus && (drawerVisible || mixSiderFixed);

  const logoStyle = {
    width: `${siderCollapse ? sider.mixCollapsedWidth : sider.mixWidth}px`
  };

  const hasLogo = Boolean(logo || logoComponent || logoTitle);

  function handleSelectMixMenu() {
    setDrawerVisible(true);
  }

  function handleResetActiveMenu() {
    setDrawerVisible(false);

    if (isFirst) {
      changeActiveFirstLevelMenuKey();
    }
  }


  return (
    <div className="h-full flex" onMouseLeave={handleResetActiveMenu}>
      <FirstLevelMenu inverted={siderInverted} mode={mode} onSelect={handleSelectMixMenu}>
        {hasLogo ? (
          <div className="flex-center px-12px" style={{ height: `${header.height}px` }}>
            <LayoutLogo
              logo={logo}
              logoComponent={logoComponent}
              showTitle={false}
              style={logoStyle}
              title={logoTitle}
              to={logoTo}
            />
          </div>
        ) : null}
      </FirstLevelMenu>
      <div
        className="relative h-full transition-width-300"
        style={{ width: mixSiderFixed && hasMenus ? `${sider.mixChildMenuWidth}px` : '0px' }}
      >
        <DarkModeContainer
          className="absolute-lt h-full flex-col-stretch nowrap-hidden shadow-sm transition-all-300"
          inverted={siderInverted}
          style={{ width: showDrawer ? `${sider.mixChildMenuWidth}px` : '0px' }}
        >
          <header className="flex-y-center justify-between px-12px" style={{ height: `${header.height}px` }}>
            <h2 className="ellipsis-text text-16px text-primary font-bold">{activeMenuLabel}</h2>
            <PinToggler
              className={classNames({ 'text-white:88 !hover:text-white': siderInverted })}
              pin={mixSiderFixed}
              pinnedTooltip={t('icon.unpin')}
              unpinnedTooltip={t('icon.pin')}
              onClick={toggleMixSiderFixed}
            />
          </header>
          <VerticalMenu />
        </DarkModeContainer>
      </div>
    </div>
  );
});

const VerticalMixMenu = (props: VerticalMixProps) => {
  const { mode } = props;

  return (
    <MenuPortal container={GLOBAL_SIDER_MENU_SELECTOR}>
      <VerticalMix mode={mode} />
    </MenuPortal>
  );
};

export default VerticalMixMenu;
