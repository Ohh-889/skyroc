'use client';

import { Input } from '@skyroc/web-ui';

const InputClearable = () => {
  return (
    <div className="w-80 max-sm:w-auto">
      <Input
        clearable
        defaultValue="default value"
      />
    </div>
  );
};

export default InputClearable;
