import type { PropsWithChildren } from 'react';

import SvgIcon from './SvgIcon';

interface LookForwardProps extends PropsWithChildren {
  /** Fallback title text when no children provided (default: 'Coming Soon') */
  title?: string;
}

const LookForward = (props: LookForwardProps) => {
  const { children, title = 'Coming Soon' } = props;

  return (
    <div className="size-full min-h-520px flex-col-center gap-24px overflow-hidden">
      <div className="flex text-400px text-primary">
        <SvgIcon localIcon="expectation" />
      </div>

      {children || <h3 className="text-28px text-primary font-500">{title}</h3>}
    </div>
  );
};

export default LookForward;
