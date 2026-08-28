'use client';

import { RadioGroup } from '@skyroc/web-ui';
import type { RadioGroupProps } from '@skyroc/web-ui';
import { useState } from 'react';

const items: RadioGroupProps['items'] = [
  { label: 'Apple', value: 'apple' },
  { label: 'Orange', value: 'orange' },
  { label: 'Banana', value: 'banana' },
  { label: 'Grape', value: 'grape' }
];

const RadioVariant = () => {
  const [value, setValue] = useState<string>('apple');

  return (
    <RadioGroup
      items={items}
      value={value}
      variant="outline"
      onValueChange={setValue}
    />
  );
};

export default RadioVariant;
