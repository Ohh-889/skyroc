'use client';

import { Checkbox } from '@skyroc/web-ui';

const sizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;

const CheckboxSize = () => {
  return (
    <div className="flex flex-wrap items-center gap-[12px]">
      {sizes.map(size => (
        <Checkbox
          defaultChecked
          key={size}
          size={size}
        >
          {size}
        </Checkbox>
      ))}
    </div>
  );
};

export default CheckboxSize;
