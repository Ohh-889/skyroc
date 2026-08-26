import type { ComponentRef } from 'react';
import { forwardRef } from 'react';
import { Content, Portal } from '@radix-ui/react-hover-card';
import { cn } from '@skyroc/utils';
import { hoverCardVariants } from './hover-card-variants';
import type { HoverCardContentProps } from './types';

const HoverCardContent = forwardRef<ComponentRef<typeof Content>, HoverCardContentProps>((props, ref) => {
  const { align = 'center', className, sideOffset = 8, ...rest } = props;

  const { content } = hoverCardVariants();

  const mergedCls = cn(content(), className);

  return (
    <Portal data-slot="hover-card-portal">
      <Content
        align={align}
        className={mergedCls}
        data-slot="hover-card-content"
        ref={ref}
        sideOffset={sideOffset}
        {...rest}
      />
    </Portal>
  );
});

HoverCardContent.displayName = 'HoverCardContent';

export default HoverCardContent;
