import { LookForward } from '@shell/ui/compose';
import { createFileRoute } from '@tanstack/react-router';

const MultiTab = () => {
  const { t } = useTranslation();

  return <LookForward title={t('common.lookForward')} />;
};

export const Route = createFileRoute('/(admin)/function/multi-tab')({
  component: MultiTab,
  staticData: {
    i18nKey: 'route.function_multi-tab',
    menu: {
      activeMenu: '/function/tab',
      hide: true,
      icon: 'ic:round-tab'
    },
    tab: {
      multi: true
    },
    title: 'function_multi-tab'
  }
});
