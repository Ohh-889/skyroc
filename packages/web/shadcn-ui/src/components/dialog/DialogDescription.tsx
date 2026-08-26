import type { ComponentRef } from 'react';
import { forwardRef } from 'react';
import { Description as _Description } from '@radix-ui/react-dialog';
import { cn } from '@skyroc/utils';
import { dialogVariants } from './dialog-variants';
import type { DialogDescriptionProps } from './types';

const DialogDescription = forwardRef<ComponentRef<typeof _Description>, DialogDescriptionProps>((props, ref) => {
  const { className, component: Description = _Description, size, ...rest } = props;

  const { description } = dialogVariants({ size });

  const mergedClass = cn(description(), className);
  return (
    <Description
      {...rest}
      className={mergedClass}
      data-slot="dialog-description"
      ref={ref}
    />
  );
});

DialogDescription.displayName = 'DialogDescription';

export default DialogDescription;
