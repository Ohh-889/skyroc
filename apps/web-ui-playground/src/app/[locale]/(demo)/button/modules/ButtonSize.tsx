'use client';

import { Button } from '@skyroc/web-ui';

const sizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;
const colors = ['primary', 'destructive', 'success', 'warning', 'info', 'carbon'] as const;

const ButtonSize = () => {
  return (
    <div className="flex flex-wrap gap-[12px]">
      {sizes.map((size, index) => (
        <Button
          color={colors[index]}
          key={size}
          size={size}
          variant="outline"
        >
          {size}
        </Button>
      ))}
    </div>
  );
};

export default ButtonSize;
