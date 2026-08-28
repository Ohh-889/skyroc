import { useSettingsTheme } from '@shell/theme';
import { InputNumber as AInputNumber, Switch as ASwitch } from 'antd';
import { useTranslation } from 'react-i18next';

import { TOP_HYBRID_LAYOUT_MODES } from '../../../../constant';
import AnimatedCollapse from '../../components/AnimatedCollapse';
import SettingItem from '../../components/SettingItem';

const FooterSettings = () => {
  const { t } = useTranslation();

  const { footer, layout, setSettings } = useSettingsTheme();

  const layoutMode = layout.mode;
  const isWrapperScrollMode = layout.scrollMode === 'wrapper';
  const isMixHorizontalMode = TOP_HYBRID_LAYOUT_MODES.includes(layoutMode);

  const updateFooter = (patch: Partial<typeof footer>) => {
    setSettings({
      footer: {
        ...footer,
        ...patch
      }
    });
  };

  const handleVisibleChange = (visible: boolean) => {
    updateFooter({ visible });
  };

  const handleFixedChange = (fixed: boolean) => {
    updateFooter({ fixed });
  };

  const handleHeightChange = (height: number | null) => {
    if (height === null) return;
    updateFooter({ height });
  };

  const handleRightChange = (right: boolean) => {
    updateFooter({ right });
  };

  return (
    <div className="flex-col-stretch gap-12px">
      <SettingItem label={t('theme.layout.footer.visible')}>
        <ASwitch
          checked={footer.visible}
          onChange={handleVisibleChange}
        />
      </SettingItem>

      <AnimatedCollapse visible={footer.visible && isWrapperScrollMode}>
        <SettingItem label={t('theme.layout.footer.fixed')}>
          <ASwitch
            checked={footer.fixed}
            onChange={handleFixedChange}
          />
        </SettingItem>
      </AnimatedCollapse>

      <AnimatedCollapse visible={footer.visible}>
        <SettingItem label={t('theme.layout.footer.height')}>
          <AInputNumber
            className="w-120px"
            min={0}
            step={1}
            value={footer.height}
            onChange={handleHeightChange}
          />
        </SettingItem>
      </AnimatedCollapse>

      <AnimatedCollapse visible={footer.visible && isMixHorizontalMode}>
        <SettingItem label={t('theme.layout.footer.right')}>
          <ASwitch
            checked={footer.right}
            onChange={handleRightChange}
          />
        </SettingItem>
      </AnimatedCollapse>
    </div>
  );
};

export default FooterSettings;
