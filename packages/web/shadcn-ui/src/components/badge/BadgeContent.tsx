import { forwardRef } from 'react';
import { cn } from '@skyroc/utils';
import { badgeVariants } from './badge-variants';
import type { BadgeContentProps } from './types';

const BadgeContent = forwardRef<HTMLSpanElement, BadgeContentProps>((props, ref) => {
  const { className, color, position, size, ...rest } = props;

  const { content } = badgeVariants({ color, position, size });

  const mergedCls = cn(content(), className);

  return (
    <span
      className={mergedCls}
      data-slot="badge-content"
      ref={ref}
      {...rest}
    />
  );
});

BadgeContent.displayName = 'BadgeContent';

export default BadgeContent;
