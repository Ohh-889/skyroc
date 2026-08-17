/* eslint-disable react-hooks/exhaustive-deps */
import { PageTab } from '@skyroc/materials';
import { FullScreen, ReloadButton } from '@skyroc/web-ui-antd';
import { BetterScroll, DarkModeContainer, SvgIcon } from '@skyroc/web-ui-compose';
import { useSettingsTheme } from '@skyroc/web-admin-theme';
import { useUpdateEffect } from 'ahooks';
import { clsx } from 'clsx';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { isPC } from '@skyroc/utils/web';

import { useAdminTab } from '../../state/tabs/use-admin-tab';
import { useAdminState } from '../../state/use-admin-state';

import { TabContextMenu } from './components/TabContextMenu';
import { useTabScroll } from './hooks/useTabScroll';

function removeFocus() {
  (document.activeElement as HTMLElement)?.blur();
}

const AdminTab = () => {
  const { t } = useTranslation();

  const { fullContent, reloadFlag: isReload, reloadPage, toggleFullContent } = useAdminState();

  const { activeTabId, addTab, initTabStore, isTabRetain, removeTab, route, switchRouteByTab, tabs } = useAdminTab();

  const { darkMode, tab: tabSettings, themeColor } = useSettingsTheme();

  const { bsScrollRef, bsWrapper, tabRef } = useTabScroll(activeTabId);

  const isPCFlag = isPC();

  function handleReloadPage() {
    reloadPage();
  }

  function getContextMenuDisabledKeys(tabId: string, index: number) {
    const disabledKeys: App.Global.DropdownKey[] = [];
    const isRetain = isTabRetain(tabId);

    if (isRetain) {
      const homeDisable: App.Global.DropdownKey[] = ['closeCurrent', 'closeLeft'];
      disabledKeys.push(...homeDisable);
    }

    if (index === 0) disabledKeys.push('closeLeft');
    if (index === tabs.length - 1) disabledKeys.push('closeRight');

    return disabledKeys;
  }

  function handleCloseTab(tab: App.Global.Tab) {
    removeTab(tab.id);
  }

  function switchTab(tab: App.Global.Tab) {
    switchRouteByTab(tab);
  }

  const tabWrapperClass =
    tabSettings.mode === 'chrome' || tabSettings.mode === 'slider' ? 'items-end' : 'items-center gap-12px';

  useEffect(() => {
    initTabStore();
  }, []);

  // Watch route and add tab
  useUpdateEffect(() => {
    addTab(route.fullPath, route.originPath);
  }, [route.fullPath]);

  return (
    <DarkModeContainer className="size-full flex-y-center px-16px shadow-tab">
      <div className="h-full flex-1-hidden" ref={bsWrapper}>
        <BetterScroll
          options={{ click: !isPCFlag, scrollX: true, scrollY: false }}
          ref={bsScrollRef}
          onClick={removeFocus}
        >
          <div className={clsx('h-full flex pr-18px', tabWrapperClass)} ref={tabRef}>
            {tabs.map((tab, index) => (
              <TabContextMenu disabledKeys={getContextMenuDisabledKeys(tab.id, index)} key={tab.id} tab={tab}>
                <div className={tabSettings.mode === 'slider' ? 'h-full' : undefined} id={tab.id}>
                  <PageTab
                    active={tab.id === activeTabId}
                    activeColor={themeColor}
                    closable={!isTabRetain(tab.id)}
                    darkMode={darkMode}
                    datatype={tab.id}
                    handleClose={() => handleCloseTab(tab)}
                    mode={tabSettings.mode}
                    prefix={
                      <SvgIcon
                        className="inline-block align-text-bottom text-16px"
                        icon={tab.icon}
                        localIcon={tab.localIcon}
                      />
                    }
                    onClick={() => switchTab(tab)}
                  >
                    <div className="max-w-240px ellipsis-text">{tab.i18nKey ? t(tab.i18nKey) : tab.label}</div>
                  </PageTab>
                </div>
              </TabContextMenu>
            ))}
          </div>
        </BetterScroll>
      </div>

      <ReloadButton isReload={isReload} tooltipContent={t('icon.reload')} onClick={handleReloadPage} />

      <FullScreen
        enterTooltip={t('icon.fullscreen')}
        exitTooltip={t('icon.fullscreenExit')}
        full={fullContent}
        toggleFullscreen={toggleFullContent}
      />
    </DarkModeContainer>
  );
};

export default AdminTab;
