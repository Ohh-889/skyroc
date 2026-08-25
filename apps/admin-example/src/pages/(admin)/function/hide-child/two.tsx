import { LookForward } from '@shell/ui/compose';
import { createFileRoute } from '@tanstack/react-router';

const HideChildTwo = () => {
  const { t } = useTranslation();

  return <LookForward title={t('common.lookForward')} />;
};

export const Route = createFileRoute('/(admin)/function/hide-child/two')({
  component: HideChildTwo,
  staticData: {
    i18nKey: 'route.function_hide-child_two',
    menu: {
      activeMenu: '/function/hide-child',
      hide: true
    },
    title: 'function_hide-child_two'
  }
});
