'use client';

import type { SelectProps } from '@skyroc/web-ui';
import { Select } from '@skyroc/web-ui';
import { useState } from 'react';

const fruits: SelectProps['items'] = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
  { label: 'Orange', value: 'orange' }
];

const Controlled = () => {
  const [value, setValue] = useState('apple');

  return (
    <div className="flex flex-col gap-3 lt-sm:w-auto w-[240px]">
      <Select
        items={fruits}
        onValueChange={setValue}
        value={value}
      />

      <div className="text-sm text-muted-foreground">Selected: {value}</div>
    </div>
  );
};

export default Controlled;
