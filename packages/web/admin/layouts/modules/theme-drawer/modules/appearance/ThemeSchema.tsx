// oxlint-disable import/no-unassigned-import
import { ThemeSchemaSegmented, useSettingsTheme } from '@shell/theme';
import { Switch as ASwitch } from 'antd';
import { useTranslation } from 'react-i18next';

import AnimatedCollapse from '../../components/AnimatedCollapse';
import SettingItem from '../../components/SettingItem';

const DarkMode = () => {
  const { t } = useTranslation();

  const { colourWeakness, darkMode, grayscale, setColourWeakness, setGrayscale, setSettings, sider } =
    useSettingsTheme();

  const handleSiderInvertedChange = (value: boolean) => {
    setSettings({ sider: { ...sider, inverted: value } });
  };

  return (
    <div className="flex-col-stretch gap-16px">
      <div className="i-flex-center">
        <ThemeSchemaSegmented />
      </div>

      <AnimatedCollapse visible={!darkMode}>
        <SettingItem label={t('theme.layout.sider.inverted')}>
          <ASwitch checked={sider.inverted} onChange={handleSiderInvertedChange} />
        </SettingItem>
      </AnimatedCollapse>

      <SettingItem label={t('theme.appearance.grayscale')}>
        <ASwitch checked={grayscale} onChange={setGrayscale} />
      </SettingItem>

      <SettingItem label={t('theme.appearance.colourWeakness')}>
        <ASwitch checked={colourWeakness} onChange={setColourWeakness} />
      </SettingItem>
    </div>
  );
};

export default DarkMode;
