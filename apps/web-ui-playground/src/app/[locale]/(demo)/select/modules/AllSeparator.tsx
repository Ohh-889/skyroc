'use client';

import type { SelectProps } from '@skyroc/web-ui';
import { Select } from '@skyroc/web-ui';

const fruits: SelectProps['items'] = [
  { label: 'Apple', value: 'apple' },
  { type: 'separator' },
  { label: 'Banana', value: 'banana' },
  { type: 'separator' },
  { label: 'Cherry', value: 'cherry' },
  { type: 'separator' },
  { label: 'Orange', value: 'orange' },
  { type: 'separator' },
  { label: 'Pear', value: 'pear' },
  { type: 'separator' },
  { label: 'Plum', value: 'plum' },
  { label: 'Strawberry', value: 'strawberry' },
  { type: 'separator' },
  { label: 'Watermelon', value: 'watermelon' }
];

const AllSeparator = () => {
  return (
    <div className="lt-sm:w-auto w-[240px]">
      <Select
        items={fruits}
        triggerProps={{
          placeholder: 'Please select a fruit'
        }}
      />
    </div>
  );
};

export default AllSeparator;
