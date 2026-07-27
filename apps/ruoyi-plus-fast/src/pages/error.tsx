import { ErrorBoundary } from '@skyroc/web-ui-antd';
import type { ErrorComponentProps } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

const ErrorPage = (props: ErrorComponentProps) => {
  const { error, reset } = props;
  const { t } = useTranslation();

  return (
    <ErrorBoundary
      error={error}
      errorHint={t('common.errorHint')}
      resetErrorBoundary={reset}
      retryText={t('common.tryAlign')}
    />
  );
};

export default ErrorPage;
