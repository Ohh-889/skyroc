import { defaultPresetColors, derivative, derivativeDark } from '../antd-algorithm';
import { transformColorWithOpacity } from '@skyroc/color';
import type { ConfigProviderProps } from 'antd';

// 注册自定义 token，antd cssVar 会据此生成 --color-inverted
declare module 'antd/es/theme/interface' {
  interface AliasToken {
    colorInverted: string;
  }
}

/**
 * Get antd theme
 *
 * @param colors Theme colors
 * @param darkMode Is dark mode
 * @param settings Theme settings
 */
export function getAntdTheme(colors: Theme.ThemeColor, darkMode: boolean, settings: Theme.ThemeSetting) {
  const { themeRadius, themeTextSize, tokens } = settings;

  const { error, info, primary, success, warning } = colors;

  const bgColor = transformColorWithOpacity(primary, darkMode ? 0.3 : 0.1, darkMode ? '#000000' : '#fff');
  const containerBgColor = darkMode ? '#1C1C1E' : tokens.light?.colors.container;

  const borderColor = darkMode ? '#2E3138' : '#C6C6C8';

  // inverted 是自定义 token，只在亮色下生效
  const invertedColor = tokens.light.colors.inverted;

  const theme: ConfigProviderProps['theme'] = {
    algorithm: [darkMode ? derivativeDark : derivative],
    cssVar: {
      key: 'root',
      prefix: ''
    },
    hashed: false,
    components: {
      Button: {
        controlHeightSM: 28
      },
      Collapse: {
        contentPadding: '16px 16px 24px 16px',
        headerBg: containerBgColor
      },
      Segmented: {
        trackPadding: 3,
        itemSelectedColor: primary
      },
      Menu: {
        darkItemBg: 'transparent',
        darkSubMenuItemBg: 'transparent',
        itemMarginInline: 8,
        itemSelectedBg: bgColor,
        subMenuItemBg: 'transparent'
      },
      Modal: {
        borderRadiusLG: 13
      }
    },
    token: {
      colorBgContainer: containerBgColor,
      colorInverted: invertedColor,
      colorError: error,
      colorInfo: info,
      fontSize: themeTextSize,
      colorBorder: borderColor,
      controlHeight: 36,
      colorPrimary: primary,
      borderRadius: themeRadius,
      colorSuccess: success,
      colorWarning: warning,
      // 使用预设的颜色
      ...defaultPresetColors
    }
  };

  return theme;
}
