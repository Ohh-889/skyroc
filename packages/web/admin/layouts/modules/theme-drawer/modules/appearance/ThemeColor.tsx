import { useSettingsTheme } from '@shell/theme';
import { Button, Switch, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';

import SettingItem from '../../components/SettingItem';

import CustomPicker from './CustomPicker';

const ThemeColor = () => {
  const { t } = useTranslation();

  const { isInfoFollowPrimary, recommendColor, setSettings, themeColor, themeColors } = useSettingsTheme();

  function handleRecommendColorChange(value: boolean) {
    setSettings({ recommendColor: value });
  }

  return (
    <div className="flex-col-stretch gap-12px">
      <Tooltip
        placement="topLeft"
        title={
          <p>
            <span className="pr-12px">{t('theme.appearance.recommendColorDesc')}</span>
            <br />
            <Button
              className="text-gray"
              href="https://uicolors.app/create"
              rel="noopener noreferrer"
              target="_blank"
              type="link"
            >
              https://uicolors.app/create
            </Button>
          </p>
        }
      >
        <div>
          <SettingItem
            key="recommend-color"
            label={t('theme.appearance.recommendColor')}
          >
            <Switch
              checked={recommendColor}
              onChange={handleRecommendColorChange}
            />
          </SettingItem>
        </div>
      </Tooltip>
      {Object.entries(themeColors).map(([key, value], index) => (
        <CustomPicker
          index={index}
          isInfoFollowPrimary={isInfoFollowPrimary}
          key={key}
          label={key}
          theme={themeColor}
          value={value as string}
        />
      ))}
    </div>
  );
};

export default ThemeColor;
