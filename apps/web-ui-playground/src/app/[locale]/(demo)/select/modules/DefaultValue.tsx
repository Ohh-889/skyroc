'use client';

import type { SelectProps } from '@skyroc/web-ui';
import { Select } from '@skyroc/web-ui';

const fruits: SelectProps['items'] = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
  { label: 'Orange', value: 'orange' },
  { label: 'Pear', value: 'pear' },
  { label: 'Plum', value: 'plum' },
  { label: 'Strawberry', value: 'strawberry' },
  { label: 'Watermelon', value: 'watermelon' }
];

const DefaultValue = () => {
  return (
    <div className="lt-sm:w-auto w-[240px]">
      <Select
        defaultValue="cherry"
        items={fruits}
        triggerProps={{
          placeholder: 'Please select a fruit'
        }}
      />
    </div>
  );
};

export default DefaultValue;
