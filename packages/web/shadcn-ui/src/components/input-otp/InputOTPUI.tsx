'use client';

import type { ComponentRef } from 'react';
import { Fragment, forwardRef } from 'react';
import InputOTPGroup from './InputOTPGroup';
import InputOTPSeparator from './InputOTPSeparator';
import InputOTPSlot from './InputOTPSlot';
import InputOtpRoot from './InputOtpRoot';
import type { InputOTPProps } from './types';

const InputOTPUI = forwardRef<ComponentRef<typeof InputOtpRoot>, InputOTPProps>((props, ref) => {
  const { className, classNames, groupProps, inputCount = 6, mask, separator, separatorProps, size, slotProps, ...rest } = props;

  const isSeparator = Boolean(separator);

  return (
    <InputOtpRoot
      className={className || classNames?.root}
      maxLength={inputCount}
      ref={ref}
      {...rest}
    >
      <InputOTPGroup
        className={classNames?.group}
        separate={isSeparator}
        size={size}
        {...groupProps}
      >
        {Array.from({ length: inputCount }).map((_, index) => (
          <Fragment key={String(index)}>
            <InputOTPSlot
              className={classNames?.input}
              index={index}
              mask={mask}
              separate={isSeparator}
              size={size}
              {...slotProps}
            />

            {isSeparator && index !== inputCount - 1
              ? (
                <InputOTPSeparator
                  className={classNames?.separator}
                  size={size}
                  {...separatorProps}
                >
                  {separator}
                </InputOTPSeparator>
              )
              : null}
          </Fragment>
        ))}
      </InputOTPGroup>
    </InputOtpRoot>
  );
});

InputOTPUI.displayName = 'InputOTPUI';

export default InputOTPUI;