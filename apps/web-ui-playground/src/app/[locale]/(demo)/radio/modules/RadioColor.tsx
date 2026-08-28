'use client';

import type { RadioGroupProps, ThemeColor } from '@skyroc/web-ui';
import { RadioGroup } from '@skyroc/web-ui';

const colors: ThemeColor[] = ['primary', 'destructive', 'success', 'warning', 'info', 'carbon', 'secondary', 'accent'];

const items: RadioGroupProps['items'] = [
  { label: 'A', value: '1' },
  { label: 'B', value: '2' },
  { label: 'C', value: '3' }
];

const RadioColor = () => {
  return (
    <div className="flex-c gap-[12px]">
      {colors.map(color => (
        <RadioGroup
          color={color}
          items={items}
          key={color}
        />
      ))}
    </div>
  );
};

export default RadioColor;
