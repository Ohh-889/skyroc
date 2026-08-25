import type React from 'react';

/** Header config */
interface AdminLayoutHeaderConfig {
  /**
   * Header class
   *
   * @default ''
   */
  headerClass?: string;
  /**
   * Header height
   *
   * @default 56px
   */
  headerHeight?: number;
  /**
   * Whether header is visible
   *
   * @default true
   */
  headerVisible?: boolean;
}

/** Tab config */
interface AdminLayoutTabConfig {
  /**
   * Tab class
   *
   * @default ''
   */
  tabClass?: string;
  /**
   * Tab height
   *
   * @default 48px
   */
  tabHeight?: number;
  /**
   * Whether tab is visible
   *
   * @default true
   */
  tabVisible?: boolean;
  /** Update siderCollapse */
  updateSiderCollapse: () => void;
}

/** Sider config */
interface AdminLayoutSiderConfig {
  /**
   * Mobile sider class
   *
   * @default ''
   */
  mobileSiderClass?: string;
  /**
   * Sider class
   *
   * @default ''
   */
  siderClass?: string;
  /**
   * Sider collapse status
   *
   * @default false
   */
  siderCollapse?: boolean;
  /**
   * Sider width when collapse is true
   *
   * @default '64px'
   */
  siderCollapsedWidth?: number;
  /**
   * Whether sider is visible
   *
   * @default true
   */
  siderVisible?: boolean;
  /**
   * Sider width when collapse is false
   *
   * @default '220px'
   */
  siderWidth?: number;
}

/** Content config */
export interface AdminLayoutContentConfig {
  /**
   * Content class
   *
   * @default ''
   */
  contentClass?: string;
  /**
   * Whether content is full the page
   *
   * If true, other elements will be hidden by `display: none`
   */
  fullContent?: boolean;
}

/** Footer config */
export interface AdminLayoutFooterConfig {
  /**
   * Whether footer is fixed
   *
   * @default true
   */
  fixedFooter?: boolean;
  /**
   * Footer class
   *
   * @default ''
   */
  footerClass?: string;
  /**
   * Footer height
   *
   * @default 48px
   */
  footerHeight?: number;
  /**
   * Whether footer is visible
   *
   * @default true
   */
  footerVisible?: boolean;
  /**
   * Whether footer is on the right side
   *
   * When the layout is vertical, the footer is on the right side
   */
  rightFooter?: boolean;
}

/**
 * Layout mode
 *
 * - Horizontal
 * - Vertical
 */
export type LayoutMode = 'horizontal' | 'vertical';

/**
 * The scroll mode when content overflow
 *
 * - Wrapper: the layout component's wrapper element has a scrollbar
 * - Content: the layout component's content element has a scrollbar
 *
 * @default 'wrapper'
 */
export type LayoutScrollMode = 'content' | 'wrapper';
export type Slots = {
  /** Main */
  children?: React.ReactNode;
  /** Footer */
  Footer?: React.ReactNode;
  /** Header */
  Header?: React.ReactNode;
  /** Sider */
  Sider?: React.ReactNode;
  /** Tab */
  Tab?: React.ReactNode;
};

/** Admin layout props */
export interface AdminLayoutProps
  extends
    AdminLayoutHeaderConfig,
    AdminLayoutTabConfig,
    AdminLayoutSiderConfig,
    AdminLayoutContentConfig,
    AdminLayoutFooterConfig,
    Slots {
  /**
   * The common class of the layout
   *
   * Is can be used to configure the transition animation
   *
   * @default 'transition-all-300'
   */
  commonClass?: string;
  /**
   * Whether fix the header and tab
   *
   * @default true
   */
  fixedTop?: boolean;
  /** Is mobile layout */
  isMobile?: boolean;
  /**
   * The max z-index of the layout
   *
   * The z-index of Header,Tab,Sider and Footer will not exceed this value
   */
  maxZIndex?: number;
  /**
   * Layout mode
   *
   * - {@link LayoutMode}
   */
  mode?: LayoutMode;
  /** The class of the scroll element */
  scrollElClass?: string;
  /**
   * The id of the scroll element of the layout
   *
   * It can be used to get the corresponding Dom and scroll it
   *
   * @example
   *   use the default id by import
   *   ```ts
   *   import { adminLayoutScrollElId } from '@sa/vue-materials';
   *   ```
   *
   * @default
   * ```ts
   * const adminLayoutScrollElId = '__ADMIN_LAYOUT_SCROLL_EL_ID__'
   * ```
   */
  scrollElId?: string;
  /**
   * Scroll mode
   *
   * - {@link ScrollMode}
   */
  scrollMode?: LayoutScrollMode;
  /** The class of the scroll wrapper element */
  scrollWrapperClass?: string;
}

type Kebab<S extends string> = S extends Uncapitalize<S> ? S : `-${Uncapitalize<S>}`;

type KebabCase<S extends string> = S extends `${infer Start}${infer End}`
  ? `${Uncapitalize<Start>}${KebabCase<Kebab<End>>}`
  : S;

type Prefix = '--soy-';

export type LayoutCssVarsProps = Pick<
  AdminLayoutProps,
  'footerHeight' | 'headerHeight' | 'siderCollapsedWidth' | 'siderWidth' | 'tabHeight'
> & {
  footerZIndex?: number;
  headerZIndex?: number;
  mobileSiderZIndex?: number;
  siderZIndex?: number;
  tabZIndex?: number;
};

export type LayoutCssVars = {
  [K in keyof LayoutCssVarsProps as `${Prefix}${KebabCase<K>}`]: string | number;
};

/**
 * The mode of the tab
 *
 * - Button: button style
 * - Chrome: chrome style
 *
 * @default chrome
 */
export type PageTabMode = 'button' | 'chrome' | 'slider';
export type ButtonTabProps = PageTabProps &
  Omit<React.ComponentProps<'div'>, 'className' | 'onClick' | 'prefix' | 'style'>;
export interface PageTabProps {
  /** Whether the tab is active */
  active?: boolean;

  /** The color of the active tab */
  activeColor?: string;
  /** The class of the button tab */
  buttonClass?: string;
  /** The class of the chrome tab */
  chromeClass?: string;
  className?: string;
  /**
   * Whether the tab is closable
   *
   * Show the close icon when true
   */
  closable?: boolean;
  /**
   * The common class of the layout
   *
   * Is can be used to configure the transition animation
   *
   * @default 'transition-all-300'
   */
  commonClass?: string;
  /** Whether is dark mode */
  darkMode?: boolean;
  handleClose?: () => void;
  /**
   * The mode of the tab
   *
   * - {@link TabMode}
   */
  mode?: PageTabMode;
  onClick: () => void;
  prefix: React.ReactNode;
  /** The class of the slider tab */
  sliderClass?: string;
  style?: React.CSSProperties;
  suffix?: React.ReactNode;
}

export type PageTabCssVarsProps = {
  primaryColor: string;
  primaryColor1: string;
  primaryColor2: string;
  primaryColorOpacity1: string;
  primaryColorOpacity2: string;
  primaryColorOpacity3: string;
};

export type PageTabCssVars = {
  [K in keyof PageTabCssVarsProps as `${Prefix}${KebabCase<K>}`]: string | number;
};
