import { ExceptionBase } from '@shell/ui/antd';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(admin)/exception/500')({
  component: GeneralError,
  staticData: {
    title: '500',
    i18nKey: 'route.exception_500',
    menu: {
      icon: 'ic:baseline-wifi-off',
      order: 3
    }
  }
});

function GeneralError() {
  const { t } = useTranslation();

  return (
    <ExceptionBase
      buttonText={t('common.backToHome')}
      type="500"
    />
  );
}
