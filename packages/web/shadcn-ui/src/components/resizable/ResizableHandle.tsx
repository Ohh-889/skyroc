import { Slot } from '@radix-ui/react-slot';
import { GripVertical } from 'lucide-react';
import { Separator as PanelResizeHandle } from 'react-resizable-panels';
import { cn } from '@skyroc/utils';
import { resizableVariants } from './resizable-variants';
import type { ResizableHandleProps } from './types';

const ResizableHandle = (props: ResizableHandleProps) => {
  const { children, className, classNames, size, withHandle, ...rest } = props;

  const { handle, handleIcon, handleIconRoot } = resizableVariants({ size });

  const mergedCls = {
    handle: cn(handle(), className),
    handleIcon: cn(handleIcon(), classNames?.handleIcon),
    handleIconRoot: cn(handleIconRoot(), classNames?.handleIconRoot)
  };

  return (
    <PanelResizeHandle
      className={mergedCls.handle}
      {...rest}
    >
      {withHandle
        ? (
          <div className={mergedCls.handleIconRoot}>
            <Slot className={mergedCls.handleIcon}>{children || <GripVertical />}</Slot>
          </div>
        )
        : null}
    </PanelResizeHandle>
  );
};

export default ResizableHandle;
