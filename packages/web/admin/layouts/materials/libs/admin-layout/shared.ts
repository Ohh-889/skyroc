import type { AdminLayoutProps, LayoutCssVars, LayoutCssVarsProps } from '../../types';

/** The id of the scroll element of the layout */
export const LAYOUT_SCROLL_EL_ID = '__SCROLL_EL_ID__';

/** The max z-index of the layout */
export const LAYOUT_MAX_Z_INDEX = 100;

/**
 * Create layout css vars by css vars props
 *
 * @param props Css vars props
 */
function createLayoutCssVarsByCssVarsProps(props: LayoutCssVarsProps) {
  const cssVars: LayoutCssVars = {
    '--soy-footer-height': `${props.footerHeight}px`,
    '--soy-footer-z-index': props.footerZIndex,
    '--soy-header-height': `${props.headerHeight}px`,
    '--soy-header-z-index': props.headerZIndex,
    '--soy-mobile-sider-z-index': props.mobileSiderZIndex,
    '--soy-sider-collapsed-width': `${props.siderCollapsedWidth}px`,
    '--soy-sider-width': `${props.siderWidth}px`,
    '--soy-sider-z-index': props.siderZIndex,
    '--soy-tab-height': `${props.tabHeight}px`,
    '--soy-tab-z-index': props.tabZIndex
  };

  return cssVars;
}

/**
 * Create layout css vars
 *
 * @param props
 */
export function createLayoutCssVars(
  props: Required<
    Pick<
      AdminLayoutProps,
      'footerHeight' | 'headerHeight' | 'maxZIndex' | 'mode' | 'siderCollapsedWidth' | 'siderWidth' | 'tabHeight'
    >
  > &
    Partial<Pick<AdminLayoutProps, 'isMobile'>>
) {
  const { footerHeight, headerHeight, isMobile, maxZIndex, mode, siderCollapsedWidth, siderWidth, tabHeight } = props;

  const headerZIndex = maxZIndex - 3;
  const tabZIndex = maxZIndex - 5;
  const siderZIndex = mode === 'vertical' || isMobile ? maxZIndex - 1 : maxZIndex - 4;
  const mobileSiderZIndex = isMobile ? maxZIndex - 2 : 0;
  const footerZIndex = maxZIndex - 5;

  const cssProps: LayoutCssVarsProps = {
    footerHeight,
    footerZIndex,
    headerHeight,
    headerZIndex,
    mobileSiderZIndex,
    siderCollapsedWidth,
    siderWidth,
    siderZIndex,
    tabHeight,
    tabZIndex
  };

  return createLayoutCssVarsByCssVarsProps(cssProps);
}
