import { useAdminTab } from '@shell/layouts';
import { createFileRoute, useNavigate } from '@tanstack/react-router';

type MultiTabSearch = Record<string, string>;

const Tab = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { removeActiveTab, removeTab, resetTabLabel, setTabLabel } = useAdminTab();

  function changeTabLabel(value: string) {
    setTabLabel(value);
  }

  function resetLabel() {
    resetTabLabel();
  }

  function goMultiTab(search?: MultiTabSearch) {
    if (search) {
      navigate({ search, to: '/function/multi-tab' });
      return;
    }

    navigate({ to: '/function/multi-tab' });
  }

  function removeAboutTab() {
    removeTab('/about').catch(() => undefined);
  }

  function closeActiveTab() {
    removeActiveTab().catch(() => undefined);
  }

  function goAbout() {
    navigate({ to: '/about' });
  }

  function goProjects() {
    navigate({ params: { pid: '123' }, to: '/projects/$pid' });
  }

  function goProjectsEdit() {
    navigate({ params: { id: '456', pid: '123' }, to: '/projects/$pid/edit/$id' });
  }

  return (
    <ASpace className="w-full" direction="vertical" size={16}>
      <ACard className="card-wrapper" size="small" title={t('page.function.tab.tabOperate.title')} variant="borderless">
        <ADivider titlePlacement="left">{t('page.function.tab.tabOperate.addTab')}</ADivider>
        <AButton onClick={goAbout}>{t('page.function.tab.tabOperate.addTabDesc')}</AButton>

        <ADivider titlePlacement="left">{t('page.function.tab.tabOperate.closeTab')}</ADivider>
        <ASpace size={16}>
          <AButton onClick={closeActiveTab}>{t('page.function.tab.tabOperate.closeCurrentTab')}</AButton>
          <AButton onClick={removeAboutTab}>{t('page.function.tab.tabOperate.closeAboutTab')}</AButton>
        </ASpace>

        <ADivider titlePlacement="left">跳转多级动态路由</ADivider>
        <ASpace wrap className="m-0!" size={16}>
          <AButton onClick={goProjects}>跳转一级动态路由</AButton>
          <AButton onClick={goProjectsEdit}>跳转多级动态路由</AButton>
        </ASpace>

        <ADivider titlePlacement="left">{t('page.function.tab.tabOperate.addMultiTab')}</ADivider>
        <ASpace wrap className="m-0!" size={16}>
          <AButton onClick={() => goMultiTab()}>{t('page.function.tab.tabOperate.addMultiTabDesc1')}</AButton>
          <AButton
            onClick={() => {
              goMultiTab({ a: '1' });
            }}
          >
            {t('page.function.tab.tabOperate.addMultiTabDesc2')}
          </AButton>
        </ASpace>
      </ACard>

      <ACard className="card-wrapper" size="small" title={t('page.function.tab.tabTitle.title')} variant="borderless">
        <ADivider titlePlacement="left">{t('page.function.tab.tabTitle.changeTitle')}</ADivider>
        <AInput.Search allowClear className="max-w-240px" enterButton={t('page.function.tab.tabTitle.change')} onSearch={changeTabLabel} />

        <ADivider titlePlacement="left">{t('page.function.tab.tabTitle.resetTitle')}</ADivider>
        <AButton onClick={resetLabel}>{t('page.function.tab.tabTitle.reset')}</AButton>
      </ACard>
    </ASpace>
  );
};

export const Route = createFileRoute('/(admin)/function/tab')({
  component: Tab,
  staticData: {
    i18nKey: 'route.function_tab',
    keepAlive: true,
    menu: {
      icon: 'ic:round-tab',
      order: 1
    },
    title: 'function_tab'
  }
});
