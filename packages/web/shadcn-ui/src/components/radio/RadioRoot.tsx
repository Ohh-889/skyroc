import { cn } from '@skyroc/utils';
import { radioVariants } from './radio-variants';
import type { RadioRootProps } from './types';

const RadioRoot = (props: RadioRootProps) => {
  const { className, size, ...rest } = props;

  const { root } = radioVariants({ size });

  const mergedCls = cn(root(), className);

  return (
    <div
      className={mergedCls}
      data-size={size}
      data-slot="radio-root"
      {...rest}
    />
  );
};

export default RadioRoot;
