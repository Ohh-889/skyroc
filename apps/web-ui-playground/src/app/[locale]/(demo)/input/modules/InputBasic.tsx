'use client';

import { Input } from '@skyroc/web-ui';
import { useState } from 'react';

const InputBasic = () => {
  const [value, setValue] = useState('');

  return (
    <div className="w-80 max-sm:w-auto">
      <Input
        placeholder="Please input"
        value={value}
        onChange={e => setValue(e.target.value)}
      />

      <p className="text-muted-foreground mt-2 text-sm">
        Value:
        {value}
      </p>
    </div>
  );
};

export default InputBasic;
