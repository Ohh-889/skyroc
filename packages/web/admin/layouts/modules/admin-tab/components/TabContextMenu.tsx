import { SvgIcon } from '@shell/ui/compose';
import { Dropdown as ADropdown, type MenuProps } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useAdminTab } from '../../../state/tabs/use-admin-tab';

interface TabContextMenuProps {
  /** 右键菜单触发区域。 */
  children: React.ReactNode;
  /** 当前场景禁用的菜单项。 */
  disabledKeys?: App.Global.DropdownKey[];
  /** 当前操作的标签页。 */
  tab: App.Global.Tab;
}

export const TabContextMenu = (props: TabContextMenuProps) => {
  const { children, disabledKeys = [], tab } = props;

  const { t } = useTranslation();

  const [open, setOpen] = useState(false);

  const { clearLeftTabs, clearRightTabs, clearTabs, fixTab, homeTab, removeTab, unfixTab } = useAdminTab();

  const { id: tabId } = tab;

  const isHomeTab = tabId === homeTab?.id;

  const isFixed = tab.fixedIndex !== undefined && tab.fixedIndex !== null;

  const items: MenuProps['items'] = [
    {
      key: 'closeCurrent',
      label: t('dropdown.closeCurrent'),
      icon: <SvgIcon className="text-icon" icon="ant-design:close-outlined" />,
      disabled: disabledKeys.includes('closeCurrent'),
      onClick: () => {
        removeTab(tabId);
      }
    },
    {
      key: 'closeOther',
      label: t('dropdown.closeOther'),
      icon: <SvgIcon className="text-icon" icon="ant-design:column-width-outlined" />,
      onClick: () => {
        clearTabs([tabId]);
      }
    },
    {
      key: 'closeLeft',
      label: t('dropdown.closeLeft'),
      icon: <SvgIcon className="text-icon" icon="mdi:format-horizontal-align-left" />,
      disabled: disabledKeys.includes('closeLeft'),
      onClick: () => {
        clearLeftTabs(tabId);
      }
    },
    {
      key: 'closeRight',
      label: t('dropdown.closeRight'),
      icon: <SvgIcon className="text-icon" icon="mdi:format-horizontal-align-right" />,
      disabled: disabledKeys.includes('closeRight'),
      onClick: () => {
        clearRightTabs(tabId);
      }
    },
    {
      key: 'closeAll',
      label: t('dropdown.closeAll'),
      icon: <SvgIcon className="text-icon" icon="ant-design:line-outlined" />,
      onClick: () => {
        clearTabs();
      }
    },
    {
      type: 'divider'
    },
    isFixed
      ? {
          key: 'unfixTab',
          label: t('dropdown.unpin'),
          icon: <SvgIcon className="text-icon" icon="mdi:pin-off-outline" />,
          onClick: () => {
            unfixTab(tabId);
          }
        }
      : {
          key: 'fixTab',
          label: t('dropdown.pin'),
          icon: <SvgIcon className="text-icon" icon="mdi:pin-outline" />,
          onClick: () => {
            fixTab(tabId);
          }
        }
  ];

  if (isHomeTab) {
    items.splice(-2);
  }

  return (
    <ADropdown menu={{ items }} open={open} trigger={['contextMenu']} onOpenChange={setOpen}>
      {children}
    </ADropdown>
  );
};
