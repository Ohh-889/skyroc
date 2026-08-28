'use client';

import { Button } from '@skyroc/web-ui';

const colors = ['primary', 'destructive', 'success', 'warning', 'info', 'carbon', 'secondary', 'accent'] as const;

const ButtonColor = () => {
  return (
    <div className="flex flex-wrap gap-[12px]">
      {colors.map(color => (
        <Button
          color={color}
          key={color}
        >
          {color}
        </Button>
      ))}
    </div>
  );
};

export default ButtonColor;
