/* eslint-disable react-hooks/exhaustive-deps */
import { useSettingsTheme } from '@shell/theme';
import { ScrollArea } from '@skyroc/web-ui';
import { useUpdateEffect } from 'ahooks';
import { Menu as AMenu, type MenuProps } from 'antd';
import { clsx } from 'clsx';
import { memo, useEffect, useState } from 'react';

import {
  FIRST_LEVEL_LAYOUT_MODES,
  LAYOUT_MODE_TOP_HYBRID_HEADER_FIRST,
  LAYOUT_MODE_VERTICAL,
  LAYOUT_MODE_VERTICAL_MIX
} from '../../../constant';
import { renderAntdMenuItems } from '../../../features/menus/menu-renderer';
import { useAdminMenus } from '../../../state/menus/use-admin-menus';
import { useAdminState } from '../../../state/use-admin-state';

const VerticalMenu = memo(() => {
  const {
    childLevelMenus,
    menus: allMenus,
    openKeys,
    route,
    routerPushByKey,
    secondLevelMenus,
    selectedKey
  } = useAdminMenus();

  const { siderCollapse, verticalMenuWidth } = useAdminState();

  const {
    darkMode,
    layout: { mode },
    sider
  } = useSettingsTheme();

  const isTopHybridHeaderFirst = mode === LAYOUT_MODE_TOP_HYBRID_HEADER_FIRST;

  const isVertical = mode === LAYOUT_MODE_VERTICAL;

  const inlineCollapsed = isVertical || isTopHybridHeaderFirst ? siderCollapse : false;

  const isVerticalMix = mode === LAYOUT_MODE_VERTICAL_MIX;

  const isMix = FIRST_LEVEL_LAYOUT_MODES.includes(mode);

  const [stateOpenKeys, setStateOpenKeys] = useState<string[]>(inlineCollapsed ? [] : openKeys);

  const darkTheme = !darkMode && sider.inverted;

  const menuTheme = darkTheme ? 'dark' : 'light';

  const scrollbarClass = 'z-10 w-7px bg-transparent p-0';

  const scrollbarThumbClass = 'rounded-10px bg-[rgba(144,147,153,0.3)] hover:bg-[rgba(144,147,153,0.3)]';

  let menus = allMenus;

  if (isVerticalMix) {
    menus = secondLevelMenus;
  } else if (isMix) {
    menus = isTopHybridHeaderFirst ? secondLevelMenus : childLevelMenus;
  }

  const menuItems = renderAntdMenuItems(menus);

  function handleClickMenu(menuInfo: Parameters<NonNullable<MenuProps['onSelect']>>[0]) {
    routerPushByKey(menuInfo.key);
  }

  function handleOpenChange(keys: string[]) {
    if (keys.includes('rc-menu-more')) {
      setStateOpenKeys(keys);
      return;
    }

    // close
    setStateOpenKeys(keys);
  }

  useEffect(() => {
    if (inlineCollapsed) return;
    setStateOpenKeys(openKeys);
  }, [route.pathname, inlineCollapsed]);

  useUpdateEffect(() => {
    if (inlineCollapsed) {
      setStateOpenKeys([]);
    } else {
      setStateOpenKeys(openKeys);
    }
  }, [inlineCollapsed]);

  return (
    <ScrollArea
      className="h-full"
      classNames={{
        scrollbar: scrollbarClass,
        thumb: scrollbarThumbClass
      }}
      orientation="vertical"
      size="xs"
      type="scroll"
    >
      <AMenu
        className={clsx('h-full transition-300 border-0!', { 'bg-container!': !darkTheme })}
        inlineCollapsed={inlineCollapsed}
        inlineIndent={18}
        items={menuItems}
        mode="inline"
        openKeys={stateOpenKeys}
        selectedKeys={selectedKey}
        style={{ width: verticalMenuWidth }}
        theme={menuTheme}
        onOpenChange={handleOpenChange}
        onSelect={handleClickMenu}
      />
    </ScrollArea>
  );
});

export default VerticalMenu;
