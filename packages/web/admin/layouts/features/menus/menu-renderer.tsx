import { BeyondHiding } from '@shell/ui/antd';
import { I18nLabel, SvgIcon } from '@shell/ui/compose';
import type { MenuProps } from 'antd';
import type { ReactNode } from 'react';
import { createElement } from 'react';

import { getAdminLayoutsOptions } from '../../setup';
import type { GeneratedMenu } from './menu-generator';
import MenuBadge from './MenuBadge';

type AntdMenuItems = NonNullable<MenuProps['items']>;

interface RenderAntdMenuItemsOptions {
  /** Ant Design 菜单模式，用于区分横向菜单和侧边菜单的 extra 布局。 */
  mode?: MenuProps['mode'];
}

function createMenuTitle(menu: GeneratedMenu) {
  return (
    <I18nLabel
      fallback={menu.title}
      i18nKey={menu.i18nKey}
    />
  );
}

function createMenuExtra(menu: GeneratedMenu) {
  const badge = menu.badge ? <MenuBadge badge={menu.badge} /> : null;
  const extra = createCustomMenuExtra(menu);

  if (badge && extra) {
    return (
      <span className="inline-flex items-center gap-6px">
        {badge}
        {extra}
      </span>
    );
  }

  return badge ?? extra;
}

function createCustomMenuExtra(menu: GeneratedMenu) {
  if (!menu.extra) return undefined;

  const { extras } = getAdminLayoutsOptions();
  const Extra = extras?.[menu.extra];

  if (!Extra) return undefined;

  return createElement(Extra, menu);
}

function renderMenu(menu: GeneratedMenu): Menu.CommonMenu {
  if (menu.type === 'divider') {
    return {
      key: menu.key,
      label: null,
      order: menu.order,
      title: menu.title,
      type: 'divider'
    };
  }

  const title = createMenuTitle(menu);
  const { defaultIcon } = getAdminLayoutsOptions();
  const commonMenu: Menu.CommonMenu = {
    extra: createMenuExtra(menu),
    i18nKey: menu.i18nKey,
    icon: (
      <SvgIcon
        icon={menu.icon || defaultIcon}
        localIcon={menu.localIcon}
        style={{ fontSize: '20px' }}
      />
    ),
    key: menu.key,
    label: <BeyondHiding title={title} />,
    order: menu.order,
    title: menu.title,
    type: menu.type
  };

  if (menu.children?.length) {
    commonMenu.children = renderCommonMenus(menu.children);
  }

  return commonMenu;
}

function createSubMenuLabel(label: ReactNode, extra: ReactNode) {
  return (
    <span
      className="box-border flex-y-center min-w-0 w-full justify-between gap-8px pr-28px"
      data-menu-submenu-label="with-extra"
    >
      <span className="min-w-0 flex-1 overflow-hidden">{label}</span>
      <span className="inline-flex shrink-0 items-center">{extra}</span>
    </span>
  );
}

function createHorizontalMenuLabel(label: ReactNode, extra: ReactNode) {
  return (
    <span
      className="inline-flex max-w-full min-w-0 items-center gap-6px"
      data-menu-horizontal-label="with-extra"
    >
      <span className="min-w-0 overflow-hidden">{label}</span>
      <span className="inline-flex shrink-0 items-center">{extra}</span>
    </span>
  );
}

function createMenuItemLabel(label: ReactNode, extra: ReactNode | undefined, isHorizontalRootMenu: boolean) {
  if (!extra) {
    return label;
  }

  if (isHorizontalRootMenu) {
    return createHorizontalMenuLabel(label, extra);
  }

  return createSubMenuLabel(label, extra);
}

function createAntdMenuItem(
  menu: Menu.CommonMenu,
  options: RenderAntdMenuItemsOptions = {},
  level = 0
): AntdMenuItems[number] {
  const { children, extra, i18nKey: _, label, ...rest } = menu;
  const isHorizontalRootMenu = options.mode === 'horizontal' && level === 0;

  if (children?.length) {
    return {
      ...rest,
      children: children.map(child => createAntdMenuItem(child, options, level + 1)),
      label: createMenuItemLabel(label, extra, isHorizontalRootMenu)
    } as AntdMenuItems[number];
  }

  if (extra && isHorizontalRootMenu) {
    return {
      ...rest,
      label: createHorizontalMenuLabel(label, extra)
    } as AntdMenuItems[number];
  }

  return {
    ...rest,
    extra,
    label
  } as AntdMenuItems[number];
}

export function renderCommonMenus(menus: GeneratedMenu[]) {
  return menus.map(renderMenu);
}

export function renderAntdMenuItems(menus: Menu.CommonMenu[], options: RenderAntdMenuItemsOptions = {}): AntdMenuItems {
  return menus.map(menu => createAntdMenuItem(menu, options));
}
