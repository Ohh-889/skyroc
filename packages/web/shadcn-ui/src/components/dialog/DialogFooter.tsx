import { forwardRef } from 'react';
import { cn } from '@skyroc/utils';
import { dialogVariants } from './dialog-variants';
import type { DialogFooterProps } from './types';

const DialogFooter = forwardRef<HTMLDivElement, DialogFooterProps>((props, ref) => {
  const { className, size, ...rest } = props;

  const { footer } = dialogVariants({ size });

  const mergedClass = cn(footer(), className);
  return (
    <footer
      {...rest}
      className={mergedClass}
      data-slot="dialog-footer"
      ref={ref}
    />
  );
});

DialogFooter.displayName = 'DialogFooter';

export default DialogFooter;
