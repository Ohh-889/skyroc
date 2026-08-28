'use client';

import type { SelectProps } from '@skyroc/web-ui';
import { Select } from '@skyroc/web-ui';
import { Apple, Banana, Cherry, Ear, Link2Icon } from 'lucide-react';

const fruits: SelectProps['items'] = [
  { label: 'Apple', leading: <Apple />, trailing: <Link2Icon className="size-4" />, value: 'apple' },
  { label: 'Banana', leading: <Banana />, value: 'banana' },
  { label: 'Cherry', leading: <Cherry />, value: 'cherry' },
  { label: 'Orange', value: 'orange' },
  { label: 'Pear', leading: <Ear />, value: 'pear' },
  { label: 'Plum', value: 'plum' },
  { label: 'Strawberry', value: 'strawberry' },
  { label: 'Watermelon', value: 'watermelon' }
];

const Disabled = () => {
  return (
    <div className="lt-sm:w-auto w-[240px]">
      <Select
        disabled
        items={fruits}
        triggerProps={{
          placeholder: 'Please select a fruit'
        }}
      />
    </div>
  );
};

export default Disabled;
