import { useSettingsTheme } from '@shell/theme';
import { InputNumber as AInputNumber, Switch as ASwitch } from 'antd';
import { useTranslation } from 'react-i18next';

import AnimatedCollapse from '../../components/AnimatedCollapse';
import SettingItem from '../../components/SettingItem';

const HeaderSettings = () => {
  const { t } = useTranslation();

  const { header, setSettings } = useSettingsTheme();

  const updateHeader = (patch: Partial<typeof header>) => {
    setSettings({
      header: {
        ...header,
        ...patch
      }
    });
  };

  const updateBreadcrumb = (patch: Partial<typeof header.breadcrumb>) => {
    updateHeader({
      breadcrumb: {
        ...header.breadcrumb,
        ...patch
      }
    });
  };

  const handleHeightChange = (height: number | null) => {
    if (height === null) return;
    updateHeader({ height });
  };

  const handleBreadcrumbVisibleChange = (visible: boolean) => {
    updateBreadcrumb({ visible });
  };

  const handleBreadcrumbShowIconChange = (showIcon: boolean) => {
    updateBreadcrumb({ showIcon });
  };

  return (
    <div className="flex-col-stretch gap-12px">
      <SettingItem label={t('theme.layout.header.height')}>
        <AInputNumber className="w-120px" min={0} step={1} value={header.height} onChange={handleHeightChange} />
      </SettingItem>

      <SettingItem label={t('theme.layout.header.breadcrumb.visible')}>
        <ASwitch checked={header.breadcrumb.visible} onChange={handleBreadcrumbVisibleChange} />
      </SettingItem>

      <AnimatedCollapse visible={header.breadcrumb.visible}>
        <SettingItem label={t('theme.layout.header.breadcrumb.showIcon')}>
          <ASwitch checked={header.breadcrumb.showIcon} onChange={handleBreadcrumbShowIconChange} />
        </SettingItem>
      </AnimatedCollapse>
    </div>
  );
};

export default HeaderSettings;
