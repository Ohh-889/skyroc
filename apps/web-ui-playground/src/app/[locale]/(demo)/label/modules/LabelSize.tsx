'use client';

import type { ThemeSize } from '@skyroc/web-ui';
import { Input, Label } from '@skyroc/web-ui';

const sizes: ThemeSize[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];

const LabelSize = () => {
  return (
    <div className="flex flex-col gap-4">
      {sizes.map(size => (
        <div
          className="flex flex-col gap-2"
          key={size}
        >
          <Label
            htmlFor={`input-${size}`}
            size={size}
          >
            {size} - Label Text
          </Label>

          <Input
            id={`input-${size}`}
            placeholder={`Size ${size}`}
            size={size}
          />
        </div>
      ))}
    </div>
  );
};

export default LabelSize;
