import { cn } from '@skyroc/utils';
import { inputOTPVariants } from './input-otp-variants';
import type { InputOTPGroupProps } from './types';

const InputOTPGroup = (props: InputOTPGroupProps) => {
  const { className, separate, size, ...rest } = props;

  const { group } = inputOTPVariants({ separate, size });

  const mergedCls = cn(group(), className);

  return (
    <div
      className={mergedCls}
      data-separate={separate}
      data-size={size}
      data-slot="input-otp-group"
      {...rest}
    />
  );
};

export default InputOTPGroup;
