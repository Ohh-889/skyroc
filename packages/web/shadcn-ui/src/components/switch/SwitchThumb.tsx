import type { ComponentRef } from 'react';
import { forwardRef } from 'react';
import { Thumb } from '@radix-ui/react-switch';
import { cn } from '@skyroc/utils';
import { switchVariants } from './switch-varianst';
import type { SwitchThumbProps } from './types';

const SwitchThumb = forwardRef<ComponentRef<typeof Thumb>, SwitchThumbProps>((props, ref) => {
  const { className, size, ...rest } = props;

  const { thumb } = switchVariants({ size });

  const mergedCls = cn(thumb(), className);

  return (
    <Thumb
      className={mergedCls}
      id="switch-thumb"
      ref={ref}
      {...rest}
    />
  );
});

SwitchThumb.displayName = 'SwitchThumb';

export default SwitchThumb;
