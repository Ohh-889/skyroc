import { cn } from '@skyroc/utils';
import { bottomSheetVariants } from './bottom-sheet-variants';
import type { BottomSheetKnobProps } from './types';

const BottomSheetKnob = (props: BottomSheetKnobProps) => {
  const { className, size, ...rest } = props;

  const { knob } = bottomSheetVariants({ size });

  const mergedCls = cn(knob(), className);

  return (
    <div
      className={mergedCls}
      {...rest}
    />
  );
};

export default BottomSheetKnob;
