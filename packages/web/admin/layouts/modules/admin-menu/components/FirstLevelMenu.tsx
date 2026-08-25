import { transformColorWithOpacity } from '@skyroc/color';
import { ScrollArea } from '@skyroc/web-ui';
import { useSettingsTheme } from '@shell/theme';
import { clsx } from 'clsx';
import { cloneElement, memo } from 'react';

import MenuToggler from '../../../state/menus/MenuToggler';
import { useAdminMenus } from '../../../state/menus/use-admin-menus';
import { useAdminState } from '../../../state/use-admin-state';

import { FirstLevelMenuMode } from '../enum';

interface FirstLevelMenuProps {
  /** 首级菜单顶部插槽。 */
  children?: React.ReactNode;
  /** 是否使用反色菜单样式。 */
  inverted?: boolean;
  /** 首级菜单展示模式。 */
  mode?: FirstLevelMenuMode;
  /** 选择带子级菜单时的回调。 */
  onSelect?: () => void;
}

interface MixMenuItemProps {
  /** Active menu item */
  active: boolean;
  inverted?: boolean;
  /** Menu item label */
  menu: Menu.CommonMenu;
  /** 菜单模式 */
  mode: FirstLevelMenuMode;
  onClick?: () => void;
  /** 选择菜单回调 */
  onSelectMenu: (key: string) => void;
}

const MixMenuItem = (props: MixMenuItemProps) => {
  const {
    active,
    inverted,
    menu: { children, extra, icon, key, label },
    onClick,
    onSelectMenu
  } = props;

  const { darkMode, themeColor } = useSettingsTheme();

  const { siderCollapse } = useAdminState();

  const { routerPushByKey } = useAdminMenus();

  const selectedBgColor = getSelectedBgColor();

  function getSelectedBgColor() {
    const light = transformColorWithOpacity(themeColor, 0.1, '#ffffff');
    const dark = transformColorWithOpacity(themeColor, 0.3, '#000000');

    return darkMode ? dark : light;
  }

  function handleSelectMixMenu() {
    onSelectMenu(key);

    if (children?.length) {
      if (onClick) onClick();
    } else {
      routerPushByKey(key);
    }
  }

  return (
    <div
      style={{ backgroundColor: active ? selectedBgColor : '' }}
      className={clsx(
        'mx-4px mb-6px flex-col-center cursor-pointer rounded-8px bg-transparent px-4px py-8px transition-300 hover:bg-[rgb(0,0,0,0.08)]',
        { 'selected-mix-menu text-primary': active },
        { 'text-white:65 hover:text-white': inverted },
        { 'bg-primary! text-white!': active && inverted }
      )}
      onClick={handleSelectMixMenu}
    >
      <div className={clsx('flex-center gap-4px')}>
        {icon && cloneElement(icon, { className: siderCollapse ? 'text-icon-small' : 'text-icon-large' } as any)}

        {!siderCollapse ? Boolean(extra) && extra : null}
      </div>

      <p
        className={clsx(
          'w-full ellipsis-text text-center text-12px transition-height-300',
          siderCollapse ? 'h-0 pt-0' : 'h-24px pt-4px'
        )}
      >
        {label}
      </p>
    </div>
  );
};

const FirstLevelMenu = memo((props: FirstLevelMenuProps) => {
  const { children, inverted, mode = FirstLevelMenuMode.All, onSelect } = props;

  const {
    sider: { mixCollapsedWidth, mixWidth }
  } = useSettingsTheme();

  const { siderCollapse } = useAdminState();

  const {
    activeFirstLevelMenuKey,
    activeSecondLevelMenuKey,
    changeActiveFirstLevelMenuKey,
    changeActiveSecondLevelMenuKey,
    menus: allMenus,
    secondLevelMenus
  } = useAdminMenus();

  const isFirst = mode === FirstLevelMenuMode.All;

  const menus = isFirst ? allMenus : secondLevelMenus;

  const activeKey = isFirst ? activeFirstLevelMenuKey : activeSecondLevelMenuKey;

  // 根据模式选择对应的激活菜单函数
  const handleSelectMenu = isFirst ? changeActiveFirstLevelMenuKey : changeActiveSecondLevelMenuKey;

  const firstLevelMenuStyle = {
    width: `${siderCollapse ? mixCollapsedWidth : mixWidth}px`
  };

  return (
    <div className="h-full flex-col-stretch flex-1-hidden">
      {children}
      <ScrollArea className="flex-1">
        <div className="h-full" style={firstLevelMenuStyle}>
          {menus
            .filter(item => item.type !== 'divider')
            .map(item => (
              <MixMenuItem
                active={item.key === activeKey}
                inverted={inverted}
                key={item.key}
                menu={item}
                mode={mode}
                onClick={onSelect}
                onSelectMenu={handleSelectMenu}
              />
            ))}
        </div>
      </ScrollArea>
      <MenuToggler arrowIcon className={clsx({ 'text-white:88 !hover:text-white': inverted })} />
    </div>
  );
});

export default FirstLevelMenu;
