import { Badge as ABadge } from 'antd';

import { useAdminMenuBadges } from '../../state/menus/use-admin-menu-badges';

interface MenuBadgeProps {
  /** Standard badge configuration from the route menu metadata. */
  badge: Router.MenuBadge;
}

function getBadgeValue(badge: Router.MenuBadge, badgeValues: Record<string, Router.MenuBadgeValue | undefined>) {
  if (!badge.valueKey) {
    return badge.value;
  }

  if (Object.hasOwn(badgeValues, badge.valueKey)) {
    return badgeValues[badge.valueKey];
  }

  return badge.value;
}

function shouldRenderValue(value: Router.MenuBadgeValue | undefined, showZero?: boolean) {
  if (value === 0) return Boolean(showZero);

  return value !== undefined && value !== null && value !== '';
}

function getBadgeColor(variant: Router.MenuBadgeVariant) {
  switch (variant) {
    case 'error':
      return 'red';
    case 'info':
      return 'blue';
    case 'primary':
      return 'blue';
    case 'success':
      return 'green';
    case 'warning':
      return 'orange';
    default:
      return undefined;
  }
}

const MenuBadge = (props: MenuBadgeProps) => {
  const { badge } = props;

  const { badgeValues } = useAdminMenuBadges();
  const { showZero = false, type = 'normal', variant = 'default' } = badge;
  const color = getBadgeColor(variant);

  if (type === 'dot') {
    return (
      <ABadge
        color={color}
        data-menu-badge="dot"
        dot
      />
    );
  }

  const value = getBadgeValue(badge, badgeValues);

  if (!shouldRenderValue(value, showZero)) return null;

  return (
    <ABadge
      color={color}
      count={value}
      data-menu-badge="normal"
      showZero={showZero}
    />
  );
};

export default MenuBadge;
