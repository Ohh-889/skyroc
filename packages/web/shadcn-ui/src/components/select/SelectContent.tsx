import type { ComponentRef } from 'react';
import { forwardRef } from 'react';
import { Content, Portal, ScrollDownButton, ScrollUpButton, Viewport } from '@radix-ui/react-select';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@skyroc/utils';
import { selectVariants } from './select-variants';
import type { SelectContentProps } from './types';

const SelectContent = forwardRef<ComponentRef<typeof Content>, SelectContentProps>((props, ref) => {
  const {
    children,
    className,
    classNames,
    position = 'popper',
    scrollDownButton,
    scrollUpButton,
    size,
    ...rest
  } = props;

  const {
    content,
    scrollDownButton: scrollDownButtonCls,
    scrollUpButton: scrollUpButtonCls,
    viewport: viewportCls
  } = selectVariants({ position, size });

  const mergedCls = {
    contentCls: cn(content(), className || classNames?.content),
    scrollDownButtonCls: cn(scrollDownButtonCls(), classNames?.scrollDownButton),
    scrollUpButtonCls: cn(scrollUpButtonCls(), classNames?.scrollUpButton),
    viewportCls: cn(viewportCls(), classNames?.viewport)
  };

  return (
    <Portal>
      <Content
        {...rest}
        className={mergedCls.contentCls}
        data-slot="select-content"
        position={position}
        ref={ref}
      >
        <ScrollUpButton
          asChild
          className={mergedCls.scrollUpButtonCls}
          data-slot="scroll-up-button"
        >
          {scrollUpButton || <ChevronUp />}
        </ScrollUpButton>

        <Viewport
          className={mergedCls.viewportCls}
          data-slot="viewport"
        >
          {children}
        </Viewport>

        <ScrollDownButton
          asChild
          className={mergedCls.scrollDownButtonCls}
          data-slot="scroll-down-button"
        >
          {scrollDownButton || <ChevronDown />}
        </ScrollDownButton>
      </Content>
    </Portal>
  );
});

SelectContent.displayName = Content.displayName;

export default SelectContent;
