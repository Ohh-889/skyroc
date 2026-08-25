import { useSettingsTheme } from '@shell/theme';
import { SvgIcon } from '@shell/ui/compose';
import { Select as ASelect, Switch as ASwitch, Tooltip as ATooltip } from 'antd';
import { useTranslation } from 'react-i18next';

import { themePageAnimationModeOptions, themeScrollModeOptions, translateOptions } from '../../../../options';

import AnimatedCollapse from '../../components/AnimatedCollapse';
import SettingItem from '../../components/SettingItem';

const ContentSettings = () => {
  const { t } = useTranslation();

  const { fixedHeaderAndTab, layout, page, setSettings } = useSettingsTheme();

  const isWrapperScrollMode = layout.scrollMode === 'wrapper';

  const scrollModeOptions = translateOptions(themeScrollModeOptions);

  const pageAnimationModeOptions = translateOptions(themePageAnimationModeOptions);

  const updateLayout = (patch: Partial<typeof layout>) => {
    setSettings({
      layout: {
        ...layout,
        ...patch
      }
    });
  };

  const updatePage = (patch: Partial<typeof page>) => {
    setSettings({
      page: {
        ...page,
        ...patch
      }
    });
  };

  const handleScrollModeChange = (scrollMode: UnionKey.ThemeScrollMode) => {
    updateLayout({ scrollMode });
  };

  const handlePageAnimateChange = (animate: boolean) => {
    updatePage({ animate });
  };

  const handlePageAnimateModeChange = (animateMode: UnionKey.ThemePageAnimateMode) => {
    updatePage({ animateMode });
  };

  const handleFixedHeaderAndTabChange = (value: boolean) => {
    setSettings({ fixedHeaderAndTab: value });
  };

  return (
    <div className="flex-col-stretch gap-12px">
      <SettingItem
        label={t('theme.layout.content.scrollMode.title')}
        suffix={
          <ATooltip title={t('theme.layout.content.scrollMode.tip')}>
            <SvgIcon className="text-icon-info" icon="mdi:information-outline" />
          </ATooltip>
        }
      >
        <ASelect
          className="w-120px"
          options={scrollModeOptions}
          size="small"
          value={layout.scrollMode}
          onChange={handleScrollModeChange}
        />
      </SettingItem>

      <SettingItem label={t('theme.layout.content.page.animate')}>
        <ASwitch checked={page.animate} onChange={handlePageAnimateChange} />
      </SettingItem>

      <AnimatedCollapse visible={page.animate}>
        <SettingItem label={t('theme.layout.content.page.mode.title')}>
          <ASelect
            className="w-120px"
            options={pageAnimationModeOptions}
            size="small"
            value={page.animateMode}
            onChange={handlePageAnimateModeChange}
          />
        </SettingItem>
      </AnimatedCollapse>

      <AnimatedCollapse visible={isWrapperScrollMode}>
        <SettingItem label={t('theme.layout.content.fixedHeaderAndTab')}>
          <ASwitch checked={fixedHeaderAndTab} onChange={handleFixedHeaderAndTabChange} />
        </SettingItem>
      </AnimatedCollapse>
    </div>
  );
};

export default ContentSettings;
