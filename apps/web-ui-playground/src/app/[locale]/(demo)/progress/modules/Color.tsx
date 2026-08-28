'use client';

import type { ProgressProps } from '@skyroc/web-ui';
import { Progress } from '@skyroc/web-ui';

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

const Color = () => {
  return (
    <div className="flex w-[320px] flex-col gap-[12px] max-sm:w-auto">
      {colors.map(color => (
        <Progress
          color={color}
          defaultValue={66}
          key={color}
          value={50}
        />
      ))}
    </div>
  );
};

export default Color;
