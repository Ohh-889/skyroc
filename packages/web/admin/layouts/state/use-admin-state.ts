import { useSettingsTheme } from '@shell/theme';
import { atomWithPartial } from '@skyroc/core-state';
import { useResponsive } from 'ahooks';
import { useAtom } from 'jotai';
import { useEffect } from 'react';

import { LAYOUT_MODE_VERTICAL_HYBRID_HEADER_FIRST, LAYOUT_MODE_VERTICAL_MIX } from '../constant';
import { getAdminLayoutsOptions } from '../setup';

const initialState = {
  siderCollapse: false,
  themeDrawerVisible: false,
  fullContent: false,
  contentXScrollable: false,
  reloadFlag: true,
  mixSiderFixed: false
};

const adminStateAtom = atomWithPartial(initialState);

export function getVerticalMenuWidth(
  layoutMode: Theme.ThemeLayoutMode,
  sider: Theme.ThemeSetting['sider'],
  siderCollapse: boolean
) {
  if (layoutMode === LAYOUT_MODE_VERTICAL_MIX || layoutMode === LAYOUT_MODE_VERTICAL_HYBRID_HEADER_FIRST) {
    return sider.mixChildMenuWidth;
  }

  return siderCollapse ? sider.collapsedWidth : sider.width;
}

export const useAdminState = () => {
  const [adminState, setAdminState] = useAtom(adminStateAtom);

  const { layout, page, sider } = useSettingsTheme();
  const { storage } = getAdminLayoutsOptions();

  const responsive = useResponsive();

  const isMobile = !responsive.sm;

  const verticalMenuWidth = getVerticalMenuWidth(layout.mode, sider, adminState.siderCollapse);

  useEffect(() => {
    setAdminState({ mixSiderFixed: storage.get('mixSiderFixed') === 'Y' });
  }, [setAdminState, storage]);

  function toggleSiderCollapse() {
    setAdminState({ siderCollapse: !adminState.siderCollapse });
  }

  function setSiderCollapse(siderCollapse: boolean) {
    setAdminState({ siderCollapse });
  }

  function openThemeDrawer() {
    setAdminState({ themeDrawerVisible: true });
  }

  function closeThemeDrawer() {
    setAdminState({ themeDrawerVisible: false });
  }

  function toggleFullContent() {
    setAdminState({ fullContent: !adminState.fullContent });
  }

  function setContentXScrollable(contentXScrollable: boolean) {
    setAdminState({ contentXScrollable });
  }

  function toggleMixSiderFixed() {
    setAdminState({ mixSiderFixed: !adminState.mixSiderFixed });
  }

  function setMixSiderFixed(mixSiderFixed: boolean) {
    setAdminState({ mixSiderFixed });
  }

  function setReloadFlag(reloadFlag: boolean) {
    setAdminState({ reloadFlag });
  }

  /**
   * Reload page
   *
   * @param duration Duration time
   */
  async function reloadPage(duration = 300) {
    setReloadFlag(false);

    const d = page.animate ? duration : 40;

    await new Promise(resolve => {
      setTimeout(resolve, d);
    });

    setReloadFlag(true);
  }

  return {
    adminState,
    ...adminState,
    isMobile,
    verticalMenuWidth,
    setAdminState,
    reloadPage,
    toggleSiderCollapse,
    setSiderCollapse,
    setContentXScrollable,
    toggleFullContent,
    openThemeDrawer,
    closeThemeDrawer,
    toggleMixSiderFixed,
    setMixSiderFixed
  };
};
