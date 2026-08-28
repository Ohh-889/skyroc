'use client';

import type { SelectOptionData } from '@skyroc/web-ui';
import { Select } from '@skyroc/web-ui';

const fruits = ['apple', 'banana', 'cherry', 'orange', 'pear', 'plum', 'strawberry', 'watermelon'];

const vegetables = ['carrot', 'potato', 'onion', 'garlic', 'tomato', 'lettuce', 'broccoli', 'cauliflower'];

const groups: SelectOptionData[] = [
  {
    label: 'Fruits',
    children: fruits.map(fruit => ({ label: fruit, value: fruit }))
  },
  { type: 'separator' },
  {
    label: 'Vegetables',
    children: vegetables.map(vegetable => ({ label: vegetable, value: vegetable }))
  }
];

const GroupOption = () => {
  return (
    <div className="lt-sm:w-auto w-[240px]">
      <Select
        items={groups}
        triggerProps={{
          placeholder: 'Please Select'
        }}
      />
    </div>
  );
};

export default GroupOption;
