import type { ComponentRef } from 'react';
import { forwardRef } from 'react';
import { Content as _Content } from '@radix-ui/react-dialog';
import { cn } from '@skyroc/utils';
import { dialogVariants } from './dialog-variants';
import type { DialogContentProps } from './types';

const DialogContent = forwardRef<ComponentRef<typeof _Content>, DialogContentProps>((props, ref) => {
  const { className, component: Content = _Content, size, ...rest } = props;

  const { content } = dialogVariants({ size });

  const mergedClass = cn(content(), className);
  return (
    <Content
      className={mergedClass}
      data-slot="dialog-content"
      ref={ref}
      {...rest}
    />
  );
});

DialogContent.displayName = 'DialogContent';

export default DialogContent;
