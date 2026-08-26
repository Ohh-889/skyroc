import { forwardRef } from 'react';
import { cn } from '@skyroc/utils';
import { buttonGroupVariants } from './button-group-variants';
import type { ButtonGroupProps } from './types';

const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>((props, ref) => {
  const { children, className, orientation, ...rest } = props;

  const mergedCls = cn(buttonGroupVariants({ orientation }), className);

  return (
    <div
      className={mergedCls}
      data-slot="button-group"
      role="group"
      {...rest}
      ref={ref}
    >
      {children}
    </div>
  );
});

ButtonGroup.displayName = 'ButtonGroup';

export default ButtonGroup;
