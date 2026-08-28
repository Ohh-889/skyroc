'use client';

import { Checkbox, CheckboxGroup } from '@skyroc/web-ui';
import type { CheckedState } from '@skyroc/web-ui';
import { useMemo, useState } from 'react';

const items = [
  { label: 'Apple', value: 'apple' },
  { label: 'Orange', value: 'orange' },
  { label: 'Banana', value: 'banana' },
  { label: 'Grape', value: 'grape' }
];

const CheckboxGroupDemo = () => {
  const [value, setValue] = useState<string[]>(['apple', 'orange']);

  const checkedState = useMemo<CheckedState>(() => {
    if (value.length === 0) {
      return false;
    }
    if (value.length === items.length) {
      return true;
    }
    return 'indeterminate';
  }, [value]);

  const handleCheckAll = (checked: CheckedState) => {
    setValue(checked === true ? items.map(item => item.value) : []);
  };

  return (
    <div className="flex flex-col gap-3">
      <Checkbox
        checked={checkedState}
        onCheckedChange={handleCheckAll}
      >
        Check All
      </Checkbox>

      <CheckboxGroup
        items={items}
        value={value}
        onValueChange={setValue}
      />
    </div>
  );
};

export default CheckboxGroupDemo;
