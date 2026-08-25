import { defaultThemeSettings, getAllPresets, showSuccessMessage, useSettingsTheme } from '@shell/theme';
import { Badge as ABadge, Button as AButton, Divider as ADivider } from 'antd';
import { defu } from 'defu';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const ThemePreset = () => {
  const { t } = useTranslation();

  const {
    setColourWeakness,
    setGrayscale,
    setSettings,
    setThemeLayout,
    setThemeScheme,
    setWatermarkEnableTime,
    setWatermarkEnableUserName
  } = useSettingsTheme();

  // Get presets from package (sorted by order)
  const presets = useMemo(() => {
    return getAllPresets().map(preset => ({
      id: preset.name.toLowerCase().replace(/\s+/g, '-'),
      ...preset
    }));
  }, []);

  function getPresetName(preset: Theme.ThemePreset): string {
    if (!preset.i18nkey) return preset.name;
    try {
      const key = `${preset.i18nkey}.name` as I18n.I18nKey;
      const translated = t(key);
      return translated !== key ? translated : preset.name;
    } catch {
      return preset.name;
    }
  }

  function getPresetDesc(preset: Theme.ThemePreset): string {
    if (!preset.i18nkey) return preset.desc;
    try {
      const key = `${preset.i18nkey}.desc` as I18n.I18nKey;
      const translated = t(key);
      return translated !== key ? translated : preset.desc;
    } catch {
      return preset.desc;
    }
  }

  function applyPreset(preset: Theme.ThemePreset): void {
    const mergedPreset = defu(preset, defaultThemeSettings);
    const { colourWeakness, grayscale, layout, themeScheme, watermark, ...rest } = mergedPreset;

    setThemeScheme(themeScheme);
    setGrayscale(grayscale);
    setColourWeakness(colourWeakness);
    setThemeLayout(layout.mode);
    setWatermarkEnableUserName(watermark.enableUserName);
    setWatermarkEnableTime(watermark.enableTime);

    setSettings({
      ...rest,
      layout: { ...layout },
      page: { ...rest.page },
      header: { ...rest.header },
      tab: { ...rest.tab },
      sider: { ...rest.sider },
      footer: { ...rest.footer },
      watermark: { ...watermark },
      tokens: { ...rest.tokens }
    });

    showSuccessMessage(t('theme.appearance.preset.applySuccess'));
  }

  return (
    <>
      <ADivider>{t('theme.appearance.preset.title')}</ADivider>

      <div className="flex flex-col gap-12px">
        {presets.map(preset => (
          <div
            className="cursor-pointer border-primary/10 rd-8px border-solid bg-white/5 p-12px backdrop-blur-10 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
            key={preset.id}
          >
            <div className="mb-8px flex items-center justify-between">
              <div className="min-w-0 w-full flex flex-1 items-center justify-between gap-8px">
                <h5 className="m-0 truncate text-14px text-primary font-600">{getPresetName(preset)}</h5>
                <ABadge
                  className="shrink-0 opacity-80"
                  count={`v${preset.version}`}
                  style={{ backgroundColor: '#2080f0' }}
                />
              </div>
              <AButton
                ghost
                className="ml-8px shrink-0"
                shape="round"
                size="small"
                type="primary"
                onClick={() => applyPreset(preset)}
              >
                {t('theme.appearance.preset.apply')}
              </AButton>
            </div>

            <p className="line-clamp-2 mb-12px text-12px text-gray-500 leading-16px">{getPresetDesc(preset)}</p>

            <div className="flex items-center justify-between">
              <div className="flex gap-4px">
                {Object.entries({ primary: preset.themeColor, ...preset.otherColor }).map(([key, color]) => (
                  <div
                    className="h-12px w-12px cursor-pointer border-white/30 rd-full transition-transform hover:scale-110"
                    key={key}
                    style={{ backgroundColor: color as string }}
                    title={key}
                  />
                ))}
              </div>
              <div className="flex items-center gap-4px">
                <div className="text-18px">{preset.themeScheme === 'dark' ? '🌙' : '☀️'}</div>
                {preset.grayscale && <div className="text-18px">🎨</div>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ThemePreset;
