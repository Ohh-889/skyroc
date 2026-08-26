import { cn } from '@skyroc/utils';
import { bottomSheetVariants } from './bottom-sheet-variants';
import type { BottomSheetContentBodyProps } from './types';

const BottomSheetContentBody = (props: BottomSheetContentBodyProps) => {
  const { className, size, ...rest } = props;

  const { contentBody } = bottomSheetVariants({ size });

  const mergedCls = cn(contentBody(), className);
  return (
    <div
      className={mergedCls}
      {...rest}
    />
  );
};

export default BottomSheetContentBody;
