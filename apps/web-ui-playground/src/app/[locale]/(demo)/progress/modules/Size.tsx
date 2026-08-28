'use client';

import type { ProgressProps } from '@skyroc/web-ui';
import { Progress } from '@skyroc/web-ui';

const sizes: ProgressProps['size'][] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];

const colors: ProgressProps['color'][] = [
  'primary',
  'destructive',
  'success',
  'warning',
  'info',
  'carbon',
  'secondary',
  'accent'
];

const Size = () => {
  return (
    <div className="flex w-[320px] flex-col gap-[12px] max-sm:w-auto">
      {sizes.map((size, index) => (
        <Progress
          color={colors[index]}
          defaultValue={66}
          key={size}
          size={size}
          value={50}
        />
      ))}
    </div>
  );
};

export default Size;
