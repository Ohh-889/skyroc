'use client';

import { RadioGroup } from '@skyroc/web-ui';
import type { RadioGroupProps } from '@skyroc/web-ui';

const items: RadioGroupProps['items'] = [
  { label: 'A', value: '1' },
  { label: 'B', value: '2' },
  { label: 'C', value: '3' }
];

const RadioDisabledAll = () => {
  return (
    <RadioGroup
      disabled
      items={items}
    />
  );
};

export default RadioDisabledAll;
