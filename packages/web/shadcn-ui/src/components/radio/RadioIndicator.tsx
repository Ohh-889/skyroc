import { Indicator } from '@radix-ui/react-radio-group';
import { cn } from '@skyroc/utils';
import { radioVariants } from './radio-variants';
import type { RadioIndicatorProps } from './types';

const RadioIndicator = (props: RadioIndicatorProps) => {
  const { className, color, variant, ...rest } = props;

  const { indicator } = radioVariants({ color, variant });

  const mergedCls = cn(indicator(), className);

  return (
    <Indicator
      className={mergedCls}
      data-color={color}
      data-slot="radio-indicator"
      {...rest}
    />
  );
};

export default RadioIndicator;
