import React from 'react';
import { cn } from '@skyroc/utils';
import { dividerVariants } from './divider-variants';
import type { DividerLabelProps } from './types';

const DividerLabel = React.forwardRef<HTMLSpanElement, DividerLabelProps>((props, ref) => {
  const { align, className, orientation, size, ...rest } = props;

  const { label } = dividerVariants({ align, orientation, size });

  const mergedCls = cn(label(), className);

  return (
    <span
      className={mergedCls}
      {...rest}
      ref={ref}
    />
  );
});

DividerLabel.displayName = 'DividerLabel';

export default DividerLabel;
