// oxlint-disable unicorn/require-module-specifiers
/** The theme namespace */
declare global {
  namespace Theme {
    /** Color palette number */
    type ColorPaletteNumber = import('@skyroc/color').ColorPaletteNumber;

    /** Watermark settings (Ant Design) */
    type WatermarkSettings = import('antd').WatermarkProps;

    /**
     * Theme mode
     *
     * - Auto: follow system theme
     * - Dark: dark mode
     * - Light: light mode
     */
    type ThemeMode = 'auto' | 'dark' | 'light';

    /**
     * Theme layout mode
     *
     * - Vertical: the vertical menu in left
     * - Horizontal: the horizontal menu in top
     * - Vertical-mix: two vertical mixed menus in left
     * - Vertical-hybrid-header-first: vertical mixed menus with header first-level menu
     * - Top-hybrid-sidebar-first: vertical first level menus in left and horizontal child level menus in top
     * - Top-hybrid-header-first: horizontal first level menus in top and vertical child level menus in left
     */
    type ThemeLayoutMode =
      | 'horizontal'
      | 'top-hybrid-header-first'
      | 'top-hybrid-sidebar-first'
      | 'vertical'
      | 'vertical-hybrid-header-first'
      | 'vertical-mix';

    /**
     * Theme scroll mode
     *
     * - Wrapper: the wrapper component's root element overflow
     * - Content: the content component overflow
     */
    type ThemeScrollMode = 'content' | 'wrapper';

    /** Theme page animate mode */
    type ThemePageAnimateMode =
      | 'fade'
      | 'fade-bottom'
      | 'fade-scale'
      | 'fade-slide'
      | 'none'
      | 'zoom-fade'
      | 'zoom-out';

    /**
     * Theme tab mode
     *
     * - Chrome: chrome style
     * - Button: button style
     */
    type ThemeTabMode = 'button' | 'chrome' | 'slider';

    /** Theme color key */
    type ThemeColorKey = 'error' | 'info' | 'primary' | 'success' | 'warning';

    /** Other color (without primary) */
    interface OtherColor {
      error: string;
      info: string;
      success: string;
      warning: string;
    }

    /** Theme color (includes primary) */
    interface ThemeColor extends OtherColor {
      primary: string;
    }

    /** Theme icons mapping */
    interface ThemeIcons {
      auto: string;
      dark: string;
      light: string;
    }

    /** Base watermark settings - platform agnostic */
    interface BaseWatermarkSettings {
      /** Font settings */
      font?: {
        fontSize?: number;
      };
      /** Height */
      height?: number;
      /** Offset */
      offset?: [number, number];
      /** Rotate angle */
      rotate?: number;
      /** Width */
      width?: number;
      /** Z-index */
      zIndex?: number;
    }

    /** Theme setting token color */
    interface ThemeSettingTokenColor {
      'base-text': string;
      container: string;
      inverted: string;
      layout: string;
      /** The progress bar color, if not set, will use the primary color */
      nprogress?: string;
    }

    /** Theme setting token box shadow */
    interface ThemeSettingTokenBoxShadow {
      header: string;
      sider: string;
      tab: string;
    }

    /** Theme setting token */
    interface ThemeSettingToken {
      boxShadow: ThemeSettingTokenBoxShadow;
      colors: ThemeSettingTokenColor;
    }

    /** Theme palette color - all color shades */
    type ThemePaletteColor = {
      [key in ThemeColorKey | `${ThemeColorKey}-${ColorPaletteNumber}`]: string;
    };

    /** Base token type */
    type BaseToken = Record<string, Record<string, string>>;

    /** Theme token color - palette + setting token color */
    type ThemeTokenColor = ThemePaletteColor & ThemeSettingTokenColor;

    /** Theme token CSS variables */
    interface ThemeTokenCSSVars {
      boxShadow: ThemeSettingTokenBoxShadow & { [key: string]: string };
      colors: ThemeTokenColor & { [key: string]: string };
    }

    /** Theme preset metadata */
    interface ThemePresetMeta {
      /** Preset description */
      desc: string;
      /** I18n key for the preset name */
      i18nkey: string;
      /** Preset name */
      name: string;
      /** Display order */
      order: number;
      /** Preset version */
      version: string;
    }

    /** Theme preset type */
    type ThemePreset = ThemePresetMeta & Partial<ThemeSetting>;

    /** Theme setting */
    interface ThemeSetting {
      /** Colour weakness mode */
      colourWeakness: boolean;
      /** Fixed header and tab */
      fixedHeaderAndTab: boolean;
      /** Footer */
      footer: {
        /** Whether fixed the footer */
        fixed: boolean;
        /** Footer height */
        height: number;
        /**
         * Whether float the footer to the right when the layout is 'top-hybrid-sidebar-first' or
         * 'top-hybrid-header-first'
         */
        right: boolean;
        /** Whether to show the footer */
        visible: boolean;
      };
      /** Grayscale mode */
      grayscale: boolean;
      /** Header */
      header: {
        /** Header breadcrumb */
        breadcrumb: {
          /** Whether to show the breadcrumb icon */
          showIcon: boolean;
          /** Whether to show the breadcrumb */
          visible: boolean;
        };
        globalSearch: {
          /** Whether to show the GlobalSearch */
          visible: boolean;
        };
        /** Header height */
        height: number;
        /** Multilingual */
        multilingual: {
          /** Whether to show the multilingual */
          visible: boolean;
        };
      };
      /** Whether info color is followed by the primary color */
      isInfoFollowPrimary: boolean;
      /** Layout */
      layout: {
        /** Layout mode */
        mode: ThemeLayoutMode;
        /** Scroll mode */
        scrollMode: ThemeScrollMode;
      };
      /** Other color */
      otherColor: OtherColor;
      /** Page */
      page: {
        /** Whether to show the page transition */
        animate: boolean;
        /** Page animate mode */
        animateMode: ThemePageAnimateMode;
      };
      /** Whether to recommend color */
      recommendColor: boolean;
      /** Sider */
      sider: {
        /** Whether to auto select the first submenu */
        autoSelectFirstMenu: boolean;
        /** Collapsed sider width */
        collapsedWidth: number;
        /** Inverted sider */
        inverted: boolean;
        /** Child menu width when the layout is 'vertical-mix', 'top-hybrid-sidebar-first', or 'top-hybrid-header-first' */
        mixChildMenuWidth: number;
        /**
         * Collapsed sider width when the layout is 'vertical-mix', 'top-hybrid-sidebar-first', or
         * 'top-hybrid-header-first'
         */
        mixCollapsedWidth: number;
        /** Sider width when the layout is 'vertical-mix', 'top-hybrid-sidebar-first', or 'top-hybrid-header-first' */
        mixWidth: number;
        /** Sider width */
        width: number;
      };
      /** Tab */
      tab: {
        /**
         * Whether to cache the tab
         *
         * If cache, the tabs will get from the local storage when the page is refreshed
         */
        cache: boolean;
        /** Whether to close tab by middle click */
        closeTabByMiddleClick: boolean;
        /** Tab height */
        height: number;
        /** Tab mode */
        mode: ThemeTabMode;
        /** Whether to show the tab */
        visible: boolean;
      };
      /** Theme color */
      themeColor: string;
      /** Theme radius */
      themeRadius: number;
      /** Theme scheme */
      themeScheme: ThemeMode;
      /** Theme text size */
      themeTextSize: number;
      /** Define some theme settings tokens, will transform to css variables */
      tokens: {
        dark?: {
          [K in keyof ThemeSettingToken]?: Partial<ThemeSettingToken[K]>;
        };
        light: ThemeSettingToken;
      };
      /** Watermark */
      watermark: {
        /** Whether to use user id as watermark text */
        enableCustomText: boolean;
        /** Whether to use current time as watermark text */
        enableTime: boolean;
        /** Whether to use user name as watermark text */
        enableUserName: boolean;
        /** Watermark settings */
        settings: WatermarkSettings;
        /** Watermark text */
        text: string;
        /** Time format for watermark text */
        timeFormat: string;

        /** Whether to show the watermark */
        visible: boolean;
      };
    }
  }

  namespace StorageType {
    interface Local {
      /** Dark mode snapshot consumed by the admin app bootstrap. */
      darkMode: boolean;
      /**
       * Theme override version flag.
       *
       * The value is the build time of the project.
       */
      overrideThemeFlag: string;
      /** Primary theme color cached by the theme package. */
      themeColor: string;
      /** Persisted admin theme settings. */
      themeSettings: Theme.ThemeSetting;
    }
  }
}

export {};
