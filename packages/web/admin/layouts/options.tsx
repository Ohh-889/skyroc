import { I18nLabel } from '@shell/ui/compose';

import {
  LAYOUT_MODE_HORIZONTAL,
  LAYOUT_MODE_TOP_HYBRID_HEADER_FIRST,
  LAYOUT_MODE_TOP_HYBRID_SIDEBAR_FIRST,
  LAYOUT_MODE_VERTICAL,
  LAYOUT_MODE_VERTICAL_HYBRID_HEADER_FIRST,
  LAYOUT_MODE_VERTICAL_MIX
} from './constant';

export function transformRecordToOption<T extends Record<string, string>>(record: T) {
  return Object.entries(record).map(([value, label]) => ({
    label,
    value
  })) as Common.Option<keyof T, T[keyof T]>[];
}

export function translateOptions(options: Common.Option<string, I18n.I18nKey>[]) {
  return options.map(option => ({
    ...option,
    label: <I18nLabel i18nKey={option.label} />
  }));
}

export const themeTabsRecord: Record<string, I18n.I18nKey> = {
  appearance: 'theme.tabs.appearance',
  layout: 'theme.tabs.layout',
  general: 'theme.tabs.general',
  preset: 'theme.tabs.preset'
};

export const themeTabsOptions = transformRecordToOption(themeTabsRecord);

export const themeLayoutModeRecord: Record<UnionKey.ThemeLayoutMode, I18n.I18nKey> = {
  [LAYOUT_MODE_VERTICAL]: 'theme.layout.layoutMode.vertical',
  [LAYOUT_MODE_VERTICAL_MIX]: 'theme.layout.layoutMode.vertical-mix',
  [LAYOUT_MODE_VERTICAL_HYBRID_HEADER_FIRST]: 'theme.layout.layoutMode.vertical-hybrid-header-first',
  [LAYOUT_MODE_HORIZONTAL]: 'theme.layout.layoutMode.horizontal',
  [LAYOUT_MODE_TOP_HYBRID_SIDEBAR_FIRST]: 'theme.layout.layoutMode.top-hybrid-sidebar-first',
  [LAYOUT_MODE_TOP_HYBRID_HEADER_FIRST]: 'theme.layout.layoutMode.top-hybrid-header-first'
};

export const themeScrollModeRecord: Record<UnionKey.ThemeScrollMode, I18n.I18nKey> = {
  content: 'theme.layout.content.scrollMode.content',
  wrapper: 'theme.layout.content.scrollMode.wrapper'
};

export const themeScrollModeOptions = transformRecordToOption(themeScrollModeRecord);

export const themeTabModeRecord: Record<UnionKey.ThemeTabMode, I18n.I18nKey> = {
  chrome: 'theme.layout.tab.mode.chrome',
  button: 'theme.layout.tab.mode.button',
  slider: 'theme.layout.tab.mode.slider'
};

export const themeTabModeOptions = transformRecordToOption(themeTabModeRecord);

export const themePageAnimationModeRecord: Record<UnionKey.ThemePageAnimateMode, I18n.I18nKey> = {
  'fade-slide': 'theme.layout.content.page.mode.fade-slide',
  fade: 'theme.layout.content.page.mode.fade',
  'fade-bottom': 'theme.layout.content.page.mode.fade-bottom',
  'fade-scale': 'theme.layout.content.page.mode.fade-scale',
  'zoom-fade': 'theme.layout.content.page.mode.zoom-fade',
  'zoom-out': 'theme.layout.content.page.mode.zoom-out',
  none: 'theme.layout.content.page.mode.none'
};

export const themePageAnimationModeOptions = transformRecordToOption(themePageAnimationModeRecord);

export const watermarkTimeFormatOptions = [
  { label: 'YYYY-MM-DD HH:mm', value: 'YYYY-MM-DD HH:mm' },
  { label: 'YYYY-MM-DD HH:mm:ss', value: 'YYYY-MM-DD HH:mm:ss' },
  { label: 'YYYY/MM/DD HH:mm', value: 'YYYY/MM/DD HH:mm' },
  { label: 'YYYY/MM/DD HH:mm:ss', value: 'YYYY/MM/DD HH:mm:ss' },
  { label: 'HH:mm', value: 'HH:mm' },
  { label: 'HH:mm:ss', value: 'HH:mm:ss' },
  { label: 'MM-DD HH:mm', value: 'MM-DD HH:mm' }
];
