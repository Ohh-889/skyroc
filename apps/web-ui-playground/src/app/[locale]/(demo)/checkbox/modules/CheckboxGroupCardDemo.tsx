'use client';

import { Checkbox, CheckboxGroupCard } from '@skyroc/web-ui';
import type { CheckedState } from '@skyroc/web-ui';
import { Apple, Banana, Cherry, Grape } from 'lucide-react';
import { useMemo, useState } from 'react';

const items = [
  { icon: <Apple className="size-5" />, label: 'Apple', value: 'apple' },
  { icon: <Cherry className="size-5" />, label: 'Orange', value: 'orange' },
  { icon: <Banana className="size-5" />, label: 'Banana', value: 'banana' },
  { icon: <Grape className="size-5" />, label: 'Grape', value: 'grape' }
];

const CheckboxGroupCardDemo = () => {
  const [value, setValue] = useState(['apple', 'orange']);

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
        color="warning"
        onCheckedChange={handleCheckAll}
      >
        Check All
      </Checkbox>

      <CheckboxGroupCard
        checkboxPosition="right"
        color="warning"
        items={items}
        shape="rounded"
        value={value}
        onValueChange={setValue}
      />
    </div>
  );
};

export default CheckboxGroupCardDemo;
