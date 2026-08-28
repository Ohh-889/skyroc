'use client';

import { InputOTP } from '@skyroc/web-ui';

const InputOtpCustomCount = () => {
  return (
    <InputOTP
      inputCount={8}
      placeholder="○"
    />
  );
};

export default InputOtpCustomCount;
