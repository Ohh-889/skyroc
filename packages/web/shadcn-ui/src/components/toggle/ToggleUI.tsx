'use client';

import { Root } from '@radix-ui/react-toggle';
import { cn } from '@skyroc/utils';
import { toggleVariants } from './toggle-variants';
import type { ToggleProps } from './types';

const ToggleUI = (props: ToggleProps) => {
  const { className, size, variant, ...rest } = props;
  const { toggle } = toggleVariants({ size, variant });

  const mergedCls = cn(toggle(), className);

  return (
    <Root
      className={mergedCls}
      data-slot="toggle"
      {...rest}
    />
  );
};

ToggleUI.displayName = 'ToggleUI';

export default ToggleUI;