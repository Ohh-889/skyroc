import { ExceptionBase } from '@skyroc/web-ui-antd';
import { createFileRoute } from '@tanstack/react-router';

const NotFound = () => {
  const { t } = useTranslation();

  return <ExceptionBase buttonText={t('common.backToHome')} type="404" />;
};

export const Route = createFileRoute('/(errors)/404')({
  component: NotFound,
  staticData: {
    title: '404',
    i18nKey: 'route.404'
  }
});
