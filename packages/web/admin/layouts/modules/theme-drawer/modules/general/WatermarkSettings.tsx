import { useSettingsTheme } from '@shell/theme';
import { Input as AInput, Select as ASelect, Switch as ASwitch } from 'antd';
import { AnimatePresence } from 'motion/react';
import type { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';

import { watermarkTimeFormatOptions } from '../../../../options';

import AnimatedItem from '../../components/AnimatedItem';
import SettingItem from '../../components/SettingItem';

const WatermarkSettings = () => {
  const { t } = useTranslation();

  const { setSettings, setWatermarkEnableTime, setWatermarkEnableUserName, watermark } = useSettingsTheme();

  const updateWatermark = (patch: Partial<typeof watermark>) => {
    setSettings({
      watermark: {
        ...watermark,
        ...patch
      }
    });
  };

  const handleVisibleChange = (visible: boolean) => {
    updateWatermark({ visible });
  };

  const handleEnableUserNameChange = (enable: boolean) => {
    setWatermarkEnableUserName(enable);
  };

  const handleEnableTimeChange = (enable: boolean) => {
    setWatermarkEnableTime(enable);
  };

  const handleTimeFormatChange = (timeFormat: string) => {
    updateWatermark({ timeFormat });
  };

  const handleEnableCustomTextChange = (enable: boolean) => {
    updateWatermark({ enableCustomText: enable });
  };

  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateWatermark({ text: e.target.value });
  };

  return (
    <div className="flex-col-stretch gap-12px">
      <SettingItem label={t('theme.general.watermark.visible')}>
        <ASwitch checked={watermark.visible} onChange={handleVisibleChange} />
      </SettingItem>

      <AnimatePresence initial={false} mode="popLayout">
        <AnimatedItem className="flex-col-stretch gap-12px" key="enableCustomText" visible={watermark.visible}>
          <SettingItem label={t('theme.general.watermark.enableCustomText')}>
            <ASwitch checked={watermark.enableCustomText} onChange={handleEnableCustomTextChange} />
          </SettingItem>
        </AnimatedItem>

        <AnimatedItem key="text" visible={watermark.visible && watermark.enableCustomText}>
          <SettingItem label={t('theme.general.watermark.text')}>
            <AInput
              className="w-120px"
              placeholder="SoybeanAdmin"
              size="small"
              value={watermark.text}
              onChange={handleTextChange}
            />
          </SettingItem>
        </AnimatedItem>

        <AnimatedItem className="flex-col-stretch gap-12px" key="enableUserName" visible={watermark.visible}>
          <SettingItem label={t('theme.general.watermark.enableUserName')}>
            <ASwitch checked={watermark.enableUserName} onChange={handleEnableUserNameChange} />
          </SettingItem>
        </AnimatedItem>

        <AnimatedItem key="enableTime" visible={watermark.visible}>
          <SettingItem label={t('theme.general.watermark.enableTime')}>
            <ASwitch checked={watermark.enableTime} onChange={handleEnableTimeChange} />
          </SettingItem>
        </AnimatedItem>

        <AnimatedItem key="timeFormat" visible={watermark.visible && watermark.enableTime}>
          <SettingItem label={t('theme.general.watermark.timeFormat')}>
            <ASelect
              className="w-210px"
              options={watermarkTimeFormatOptions}
              size="small"
              value={watermark.timeFormat}
              onChange={handleTimeFormatChange}
            />
          </SettingItem>
        </AnimatedItem>
      </AnimatePresence>
    </div>
  );
};

export default WatermarkSettings;
