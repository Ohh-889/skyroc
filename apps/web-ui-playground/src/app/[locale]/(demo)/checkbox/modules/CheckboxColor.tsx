'use client';

import { Checkbox } from '@skyroc/web-ui';

const colors = ['primary', 'destructive', 'success', 'warning', 'info', 'carbon', 'secondary', 'accent'] as const;

const CheckboxColor = () => {
  return (
    <div className="flex flex-wrap gap-[12px]">
      {colors.map(color => (
        <Checkbox
          defaultChecked
          color={color}
          key={color}
        >
          {color}
        </Checkbox>
      ))}
    </div>
  );
};

export default CheckboxColor;
