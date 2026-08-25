import classNames from 'clsx';
import { type FC } from 'react';
import type { AdminLayoutProps } from '../../types';
import { LAYOUT_MAX_Z_INDEX, LAYOUT_SCROLL_EL_ID, createLayoutCssVars } from './shared';
import style from './index.module.css';

// eslint-disable-next-line complexity
const AdminLayout: FC<AdminLayoutProps> = ({
  children,
  commonClass = 'transition-all-300',
  contentClass,
  fixedFooter,
  fixedTop = true,
  Footer,
  footerClass,
  footerHeight = 48,
  footerVisible = true,
  fullContent,
  Header,
  headerClass,
  headerHeight = 56,
  headerVisible = true,
  isMobile,
  maxZIndex = LAYOUT_MAX_Z_INDEX,
  mobileSiderClass,
  mode = 'vertical',
  rightFooter = false,
  scrollElId = LAYOUT_SCROLL_EL_ID,
  scrollMode = 'content',
  scrollWrapperClass,
  Sider,
  siderClass,
  siderCollapse = false,
  siderCollapsedWidth = 64,
  siderVisible = true,
  siderWidth = 220,
  Tab,
  tabClass,
  tabHeight = 44,
  tabVisible = true,
  updateSiderCollapse
  // eslint-disable-next-line complexity
}) => {
  const cssVar = createLayoutCssVars({
    footerHeight,
    headerHeight,
    isMobile,
    maxZIndex,
    mode,
    siderCollapsedWidth,
    siderWidth,
    tabHeight
  }) as React.CSSProperties;
  // config visible
  const showHeader = Boolean(Header) && headerVisible;
  const showSider = !isMobile && Boolean(Sider) && siderVisible;
  const showMobileSider = isMobile && Boolean(Sider) && siderVisible;
  const showTab = Boolean(Tab) && tabVisible;
  const showFooter = Boolean(Footer) && footerVisible;

  // scroll mode
  const isWrapperScroll = scrollMode === 'wrapper';
  const isContentScroll = scrollMode === 'content';
  // layout direction
  const isVertical = mode === 'vertical';
  const isHorizontal = mode === 'horizontal';
  const fixedHeaderAndTab = fixedTop || (isHorizontal && isWrapperScroll);

  // css
  const leftGapClass = () => {
    if (!fullContent && showSider) {
      return siderCollapse ? style['left-gap_collapsed'] : style['left-gap'];
    }
    return '';
  };
  const headerLeftGapClass = isVertical ? leftGapClass() : '';

  const footerLeftGapClass = () => {
    const condition1 = isVertical;
    const condition2 = isHorizontal && isWrapperScroll && !fixedFooter;
    const condition3 = Boolean(isHorizontal && rightFooter);

    if (condition1 || condition2 || condition3) {
      return leftGapClass();
    }

    return '';
  };
  const siderPaddingClass = () => {
    let cls = '';

    if (showHeader && !headerLeftGapClass) {
      cls += style['sider-padding-top'];
    }
    if (showFooter && !footerLeftGapClass()) {
      cls += ` ${style['sider-padding-bottom']}`;
    }

    return cls;
  };
  // display
  const headerDisplay = !fullContent && fixedHeaderAndTab ? 'block' : 'none';
  const siderDisplay = fullContent ? 'none' : 'block';
  const mobileSider = siderCollapse ? 'none' : 'block';
  const footerDisplay = !fullContent && fixedFooter ? 'block' : 'none';

  return (
    <section className={classNames('relative h-full', commonClass)} style={cssVar}>
      <section
        id={isWrapperScroll ? scrollElId : ''}
        className={classNames('h-full flex flex-col', scrollWrapperClass, commonClass, {
          'overflow-y-auto': isWrapperScroll
        })}
      >
        {/* Header */}
        {showHeader && (
          <>
            <header
              style={{ display: fullContent ? 'none' : 'block' }}
              className={classNames(
                'flex-shrink-0',
                style['layout-header'],
                commonClass,
                headerClass,
                headerLeftGapClass,
                { 'absolute left-0 top-0 w-full': fixedHeaderAndTab }
              )}
            >
              {Header}
            </header>
            <div
              className={classNames('flex-shrink-0 overflow-hidden', style['layout-header-placement'])}
              style={{ display: headerDisplay }}
            />
          </>
        )}

        {/* Tab */}
        {showTab && (
          <>
            <div
              className={classNames(
                'flex-shrink-0',
                style['layout-tab'],
                commonClass,
                tabClass,
                { 'top-0!': fullContent || !showHeader },
                leftGapClass(),
                { 'absolute left-0 w-full': fixedHeaderAndTab }
              )}
            >
              {Tab}
            </div>

            <div
              className={classNames('flex-shrink-0 overflow-hidden', [style['layout-tab-placement']])}
              style={{ display: fixedHeaderAndTab || fullContent ? 'block' : 'none' }}
            />
          </>
        )}

        {/* Sider */}
        {showSider && (
          <aside
            style={{ display: siderDisplay }}
            className={classNames(
              'absolute left-0 top-0 h-full',
              commonClass,
              siderClass,
              siderPaddingClass(),
              siderCollapse ? style['layout-sider_collapsed'] : style['layout-sider']
            )}
          >
            {Sider}
          </aside>
        )}

        {/* Mobile Sider */}
        {showMobileSider && (
          <>
            <aside
              className={classNames('absolute left-0 top-0 h-full w-0 bg-white', [
                commonClass,
                siderClass,
                mobileSiderClass,
                style['layout-mobile-sider'],
                siderCollapse ? 'overflow-hidden' : style['layout-sider']
              ])}
            >
              {Sider}
            </aside>
            <div
              style={{ display: mobileSider }}
              className={classNames('absolute left-0 top-0 h-full w-full bg-[rgba(0,0,0,0.2)]', [
                style['layout-mobile-sider-mask']
              ])}
              onClick={() => updateSiderCollapse()}
            />
          </>
        )}

        {/*  Main Content  */}
        <main
          id={isContentScroll ? scrollElId : ''}
          className={classNames('flex flex-col flex-grow bg-layout', commonClass, contentClass, leftGapClass(), {
            'overflow-y-auto': isContentScroll
          })}
        >
          {children}
        </main>

        {/* Footer */}
        {showFooter && (
          <>
            <footer
              style={{ display: siderDisplay }}
              className={classNames(
                'flex-shrink-0',
                style['layout-footer'],
                commonClass,
                footerClass,
                footerLeftGapClass(),
                { 'absolute bottom-0 left-0 w-full': fixedFooter }
              )}
            >
              {Footer}
            </footer>
            <div
              className={classNames('flex-shrink-0 overflow-hidden', style['layout-footer-placement'])}
              style={{ display: footerDisplay }}
            />
          </>
        )}
      </section>
    </section>
  );
};
export default AdminLayout;
