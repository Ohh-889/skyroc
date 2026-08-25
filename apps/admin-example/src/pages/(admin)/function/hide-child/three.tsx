import { LookForward } from '@shell/ui/compose';
import { createFileRoute } from '@tanstack/react-router';

const HideChildThree = () => {
  const { t } = useTranslation();

  return <LookForward title={t('common.lookForward')} />;
};

export const Route = createFileRoute('/(admin)/function/hide-child/three')({
  component: HideChildThree,
  staticData: {
    i18nKey: 'route.function_hide-child_three',
    menu: {
      activeMenu: '/function/hide-child',
      hide: true
    },
    title: 'function_hide-child_three'
  }
});
