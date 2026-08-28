import { I18nLabel, SvgIcon } from '@shell/ui/compose';
import { Link } from '@tanstack/react-router';
import { Breadcrumb as ABreadcrumb, type BreadcrumbProps } from 'antd';

import { getAdminLayoutsOptions } from '../../../setup';
import { useAdminMenus } from '../../../state/menus/use-admin-menus';

const itemRender: BreadcrumbProps['itemRender'] = (currentRoute, _, items) => {
  const isLast = currentRoute?.path === items[items.length - 1]?.path;

  return isLast ? (
    <div className="flex-y-center text-base-text">{currentRoute.title}</div>
  ) : (
    <Link
      className="inline-flex! items-center whitespace-nowrap hover:text-base-text!"
      to={currentRoute.path}
    >
      {currentRoute.title}
    </Link>
  );
};

const AdminBreadcrumb = () => {
  const { activeMenu, currentMenu, getMenuInfoByPath, home, openKeys, selectedKey } = useAdminMenus();
  const { defaultIcon } = getAdminLayoutsOptions();

  const isHome = selectedKey[0] === home;

  const allBreadcrumb = [isHome ? null : home, ...openKeys, ...selectedKey, activeMenu ? currentMenu?.key : null];

  const breadcrumb = allBreadcrumb
    .map(key => {
      if (!key) return null;

      const menuInfo = getMenuInfoByPath(key as Router.RoutePath);

      if (!menuInfo) return null;

      return {
        title: (
          <>
            <SvgIcon
              className="text-icon mr-4px"
              icon={menuInfo.menu?.icon || defaultIcon}
              localIcon={menuInfo.menu?.localIcon}
            />
            <span>
              <I18nLabel
                fallback={menuInfo.title}
                i18nKey={menuInfo.i18nKey}
              />
            </span>
          </>
        ),
        path: menuInfo?.path
      };
    })
    .filter(Boolean) as BreadcrumbProps['items'];

  return (
    <ABreadcrumb
      className="ml-12px"
      itemRender={itemRender}
      items={breadcrumb}
    />
  );
};

export default AdminBreadcrumb;
