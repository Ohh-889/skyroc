'use client';

import { Input } from '@skyroc/web-ui';

const InputDisabled = () => {
  return (
    <div className="w-80 max-sm:w-auto">
      <Input
        disabled
        placeholder="Please input"
        value="the input is disabled"
      />
    </div>
  );
};

export default InputDisabled;
