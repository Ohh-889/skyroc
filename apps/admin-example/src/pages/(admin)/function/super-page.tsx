import { LookForward } from '@shell/ui/compose';
import { createFileRoute } from '@tanstack/react-router';

const SuperPage = () => {
  const { t } = useTranslation();

  return <LookForward title={t('common.lookForward')} />;
};

export const Route = createFileRoute('/(admin)/function/super-page')({
  component: SuperPage,
  staticData: {
    i18nKey: 'route.function_super-page',
    menu: {
      icon: 'ic:round-supervisor-account',
      order: 5
    },
    permissions: ['R_SUPER'],
    title: 'function_super-page'
  }
});
