import { SvgIcon } from '@shell/ui/compose';
import { useNavigate, useRouter } from '@tanstack/react-router';
import { Button } from 'antd';
import { memo } from 'react';

type ExceptionType = '403' | '404' | '500';

interface HomeRouteContext {
  getHomeRoute?: () => string;
  homeRoute?: string;
}

export interface ExceptionBaseProps {
  /** Button text (default: 'Back to Home') */
  buttonText?: string;
  /** Home route used by the action button. Defaults to the router context home route. */
  homePath?: string;
  /**
   * Exception type
   *
   * - 403: no permission
   * - 404: not found
   * - 500: service error
   */
  type: ExceptionType;
}

const iconMap: Record<ExceptionType, string> = {
  '403': 'no-permission',
  '404': 'not-found',
  '500': 'service-error'
};

function getHomePath(context: unknown) {
  if (!context || typeof context !== 'object') {
    return '/';
  }

  const { getHomeRoute, homeRoute } = context as HomeRouteContext;

  return homeRoute || getHomeRoute?.() || '/';
}

const ExceptionBase = memo((props: ExceptionBaseProps) => {
  const { buttonText = 'Back to Home', homePath, type } = props;

  const nav = useNavigate();
  const router = useRouter();
  const targetHomePath = homePath || getHomePath(router.options.context);

  function handleClick() {
    nav({ to: targetHomePath });
  }

  return (
    <div className="size-full min-h-520px flex-col-center gap-24px overflow-hidden">
      <div className="flex text-400px text-primary">
        <SvgIcon localIcon={iconMap[type]} />
      </div>
      <Button type="primary" onClick={handleClick}>
        {buttonText}
      </Button>
    </div>
  );
});

ExceptionBase.displayName = 'ExceptionBase';

export default ExceptionBase;
