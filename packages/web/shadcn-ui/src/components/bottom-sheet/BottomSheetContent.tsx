import type { ComponentRef } from 'react';
import { forwardRef } from 'react';
import { Content, Portal } from 'vaul';
import { cn } from '@skyroc/utils';
import BottomSheetContentBody from './BottomSheetContentBody';
import BottomSheetKnob from './BottomSheetKnob';
import BottomSheetOverlay from './BottomSheetOverlay';
import { bottomSheetVariants } from './bottom-sheet-variants';
import type { BottomSheetContentProps } from './types';

const BottomSheetContent = forwardRef<ComponentRef<typeof Content>, BottomSheetContentProps>((props, ref) => {
  const { children, className, classNames, size, ...rest } = props;

  const { content } = bottomSheetVariants({ size });

  const mergedCls = cn(content(), className, classNames?.content);

  return (
    <Portal>
      <BottomSheetOverlay className={classNames?.overlay} />

      <Content
        className={mergedCls}
        data-slot="bottom-sheet-content"
        ref={ref}
        {...rest}
      >
        <BottomSheetContentBody className={classNames?.contentBody}>
          <BottomSheetKnob className={classNames?.knob} />
          {children}
        </BottomSheetContentBody>
      </Content>
    </Portal>
  );
});

BottomSheetContent.displayName = 'BottomSheetContent';

export default BottomSheetContent;
