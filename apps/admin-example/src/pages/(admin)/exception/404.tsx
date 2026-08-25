import { ExceptionBase } from '@shell/ui/antd';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(admin)/exception/404')({
  component: NotFound,
  staticData: {
    title: '404',
    i18nKey: 'route.exception_404',
    menu: {
      icon: 'ic:baseline-web-asset-off',
      order: 2
    }
  }
});

function NotFound() {
  const { t } = useTranslation();

  return <ExceptionBase buttonText={t('common.backToHome')} type="404" />;
}
