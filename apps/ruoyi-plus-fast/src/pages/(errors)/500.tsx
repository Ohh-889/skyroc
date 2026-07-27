import { ExceptionBase } from '@skyroc/web-ui-antd';
import { createFileRoute } from '@tanstack/react-router';

const GeneralError = () => {
  const { t } = useTranslation();

  return <ExceptionBase buttonText={t('common.backToHome')} type="500" />;
};

export const Route = createFileRoute('/(errors)/500')({
  component: GeneralError,
  staticData: {
    title: '500',
    i18nKey: 'route.500'
  }
});
