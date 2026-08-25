import { useSettingsTheme } from '@shell/theme';
import { InputNumber as AInputNumber } from 'antd';
import { useTranslation } from 'react-i18next';

import SettingItem from '../../components/SettingItem';

const ThemeToken = () => {
  const { t } = useTranslation();

  const { setSettings, themeRadius, themeTextSize } = useSettingsTheme();

  function handleThemeRadiusChange(value: number | null) {
    if (value === null) return;

    setSettings({ themeRadius: value });
  }

  function handleThemeTextSizeChange(value: number | null) {
    if (value === null) return;

    setSettings({ themeTextSize: value });
  }

  return (
    <div className="flex-col-stretch gap-12px">
      <SettingItem label={t('theme.appearance.themeBase.textSize')}>
        <AInputNumber className="w-120px" min={0} step={1} value={themeTextSize} onChange={handleThemeTextSizeChange} />
      </SettingItem>

      <SettingItem label={t('theme.appearance.themeBase.radius')}>
        <AInputNumber
          className="w-120px"
          max={16}
          min={0}
          step={1}
          value={themeRadius}
          onChange={handleThemeRadiusChange}
        />
      </SettingItem>
    </div>
  );
};

export default ThemeToken;
