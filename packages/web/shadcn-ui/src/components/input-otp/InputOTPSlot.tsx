'use client';

import { useContext } from 'react';
import { OTPInputContext } from 'input-otp';
import { cn } from '@skyroc/utils';
import { inputOTPVariants } from './input-otp-variants';
import type { InputOTPSlotProps } from './types';

const InputOTPSlot = (props: InputOTPSlotProps) => {
  const { className, index, mask, separate, size, ...rest } = props;

  const inputOTPContext = useContext(OTPInputContext);

  const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index];

  const { input } = inputOTPVariants({ isActive, separate, size });

  const mergedCls = cn(input(), className);

  return (
    <div
      className={mergedCls}
      data-has-fake-caret={hasFakeCaret}
      data-index={index}
      data-is-active={isActive}
      data-separate={separate}
      data-size={size}
      data-slot="input-otp-slot"
      {...rest}
    >
      {mask && char ? '●' : char}

      {hasFakeCaret
        ? (
          <div className="absolute inset-0 flex cursor-not-allowed items-center justify-center">
            <div className="animate-caret-blink bg-foreground h-4 w-px duration-1000" />
          </div>
        )
        : null}
    </div>
  );
};

export default InputOTPSlot;
