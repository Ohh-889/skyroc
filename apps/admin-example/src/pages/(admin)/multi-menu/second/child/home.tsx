import { LookForward } from '@shell/ui/compose';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(admin)/multi-menu/second/child/home')({
  component: RouteComponent,
  staticData: {
    title: 'multi-menu_second_child_home',
    i18nKey: 'route.multi-menu_second_child_home',
    menu: {
      order: 1
    }
  }
});

function RouteComponent() {
  const { t } = useTranslation();

  return <LookForward title={t('common.lookForward')} />;
}
