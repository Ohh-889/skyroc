import { cn } from '@skyroc/utils';
import { Minus } from 'lucide-react';
import { isValidElement } from 'react';
import { inputOTPVariants } from './input-otp-variants';
import type { InputOTPSeparatorProps } from './types';

const InputOTPSeparator = (props: InputOTPSeparatorProps) => {
  const { children, className, size, ...rest } = props;

  const { separator } = inputOTPVariants({ size });

  const mergedCls = cn(separator(), className);

  return (
    <div
      className={mergedCls}
      data-size={size}
      data-slot="input-otp-separator"
      {...rest}
    >
      {isValidElement(children) ? children : <Minus />}
    </div>
  );
};

export default InputOTPSeparator;
