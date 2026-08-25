import { SvgIcon } from '@shell/ui/compose';
import { Button, Typography } from 'antd';
import type { FallbackProps } from 'react-error-boundary';

const { Text, Title } = Typography;

interface ErrorBoundaryProps extends FallbackProps {
  /** Error hint text shown in production (default: 'Something went wrong') */
  errorHint?: string;
  /** Whether in development mode */
  isDev?: boolean;
  /** Retry button text (default: 'Try Again') */
  retryText?: string;
  /** Theme color for the reset button */
  themeColor?: string;
}

const ErrorPage = (props: ErrorBoundaryProps) => {
  const {
    error,
    errorHint = 'Something went wrong',
    isDev = false,
    resetErrorBoundary,
    retryText = 'Try Again',
    themeColor
  } = props;

  return (
    <div className="size-full min-h-520px flex-col-center gap-16px overflow-hidden">
      <div className="flex text-400px text-primary">
        <SvgIcon localIcon="error" />
      </div>
      {isDev ? <Text code>{error.message}</Text> : <Title level={3}>{errorHint}</Title>}
      <Button
        style={themeColor ? { backgroundColor: themeColor } : undefined}
        type="primary"
        onClick={resetErrorBoundary}
      >
        {retryText}
      </Button>
    </div>
  );
};

export default ErrorPage;
