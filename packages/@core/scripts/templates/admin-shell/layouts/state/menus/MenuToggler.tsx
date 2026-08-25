import { ButtonIcon } from '@shell/ui/antd';
import { SvgIcon } from '@shell/ui/compose';
import { useTranslation } from 'react-i18next';

import { useAdminState } from '../use-admin-state';

interface Props {
  /** Arrow style icon */
  arrowIcon?: boolean;
  /** Button class name. */
  className?: string;
}

type NumberBool = 0 | 1;

const icons: Record<NumberBool, Record<NumberBool, string>> = {
  0: {
    0: 'line-md:menu-fold-left',
    1: 'line-md:menu-fold-right'
  },
  1: {
    0: 'ph-caret-double-left-bold',
    1: 'ph-caret-double-right-bold'
  }
};

const MenuToggler = (props: Props) => {
  const { arrowIcon, className } = props;

  const { t } = useTranslation();

  const { siderCollapse, toggleSiderCollapse } = useAdminState();

  const isArrowIcon = Number(arrowIcon || false) as NumberBool;
  const isCollapsed = Number(siderCollapse || false) as NumberBool;

  const icon = icons[isArrowIcon][isCollapsed];

  const tooltipContent = siderCollapse ? t('icon.expand') : t('icon.collapse');

  return (
    <ButtonIcon
      className={className}
      tooltipContent={tooltipContent}
      tooltipPlacement="bottomLeft"
      onClick={toggleSiderCollapse}
    >
      <SvgIcon icon={icon} />
    </ButtonIcon>
  );
};

export default MenuToggler;
