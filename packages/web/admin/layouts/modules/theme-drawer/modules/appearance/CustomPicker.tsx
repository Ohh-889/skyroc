import { useSettingsTheme } from '@shell/theme';
import {
  Checkbox as ACheckbox,
  type CheckboxProps,
  ColorPicker as AColorPicker,
  type ColorPickerProps,
  Flex as AFlex,
  Space as ASpace,
  Tooltip as ATooltip
} from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import SettingItem from '../../components/SettingItem';

const swatches: { color: string; name: string }[] = [
  { color: '#3b82f6', name: '海洋蓝' },
  { color: '#6366f1', name: '紫罗兰' },
  { color: '#8b5cf6', name: '梦幻紫' },
  { color: '#a855f7', name: '迷人紫' },
  { color: '#0ea5e9', name: '清澈海洋' },
  { color: '#06b6d4', name: '天空蓝' },
  { color: '#f43f5e', name: '樱桃红' },
  { color: '#ef4444', name: '火焰红' },
  { color: '#ec4899', name: '玫瑰粉' },
  { color: '#d946ef', name: '紫色魅影' },
  { color: '#f97316', name: '橙色阳光' },
  { color: '#f59e0b', name: '金色晨曦' },
  { color: '#eab308', name: '柠檬黄' },
  { color: '#84cc16', name: '草地绿' },
  { color: '#22c55e', name: '清新绿' },
  { color: '#10b981', name: '热带绿' }
];

interface Props {
  index: number;
  isInfoFollowPrimary: boolean;
  label: string;
  theme: string;
  value: string;
}

const CustomPicker = (props: Props) => {
  const { isInfoFollowPrimary, label, theme, value } = props;

  const { t } = useTranslation();

  const { setSettings, updateThemeColors } = useSettingsTheme();

  function handleUpdateColor(color: string, name: Theme.ThemeColorKey) {
    updateThemeColors(name, color);
  }

  const [selectTheme, setSelectTheme] = useState<string>(theme);

  const onChange: CheckboxProps['onChange'] = e => {
    setSettings({ isInfoFollowPrimary: e.target.checked });
  };

  const customPanelRender: ColorPickerProps['panelRender'] = (_, { components: { Picker } }) => (
    <ASpace
      className="w-250px"
      orientation="vertical"
    >
      <>
        <Picker />
        <AFlex
          wrap
          gap="small"
        >
          {swatches.map(item => (
            <ATooltip
              key={item.name}
              title={item.name}
            >
              <span
                onClick={() => {
                  handleUpdateColor(item.color, selectTheme as Theme.ThemeColorKey);
                }}
              >
                <AColorPicker
                  defaultValue={item.color}
                  open={false}
                  size="small"
                />
              </span>
            </ATooltip>
          ))}
        </AFlex>
      </>
    </ASpace>
  );

  return (
    <SettingItem
      label={t(`theme.appearance.themeColor.${label}`)}
      suffix={
        label === 'info' && (
          <ACheckbox
            checked={isInfoFollowPrimary}
            onChange={onChange}
          >
            {t('theme.appearance.themeColor.followPrimary')}
          </ACheckbox>
        )
      }
    >
      <AColorPicker
        disabled={label === 'info' && isInfoFollowPrimary}
        panelRender={customPanelRender}
        value={value}
        onChangeComplete={hex => handleUpdateColor(hex.toHexString(), label as Theme.ThemeColorKey)}
        onOpenChange={() => {
          setSelectTheme(label);
        }}
      />
    </SettingItem>
  );
};

export default CustomPicker;
