import { LookForward } from '@shell/ui/compose';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(admin)/multi-menu/first/child')({
  component: FirstChild,
  staticData: {
    title: 'first-child',
    i18nKey: 'route.multi-menu_first_child',
    menu: {
      order: 1
    }
  }
});

function FirstChild() {
  const { t } = useTranslation();

  return <LookForward title={t('common.lookForward')} />;
}
