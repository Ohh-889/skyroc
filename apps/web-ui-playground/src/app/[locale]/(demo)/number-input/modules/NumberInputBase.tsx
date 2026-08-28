'use client';

import { NumberInput } from '@skyroc/web-ui';

const NumberInputBase = () => {
  return (
    <div className="w-80 max-sm:w-auto">
      <NumberInput placeholder="Please input" />
    </div>
  );
};

export default NumberInputBase;
