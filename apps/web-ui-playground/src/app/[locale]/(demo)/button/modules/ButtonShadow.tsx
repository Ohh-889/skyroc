'use client';

import { Button } from '@skyroc/web-ui';

const shadows = ['none', 'sm', 'md', 'lg'] as const;
const colors = ['primary', 'destructive', 'success', 'warning'] as const;

const ButtonShadow = () => {
  return (
    <div className="flex flex-wrap gap-[12px]">
      {shadows.map((shadow, index) => (
        <Button
          color={colors[index]}
          key={shadow}
          shadow={shadow}
          variant="plain"
        >
          {shadow}
        </Button>
      ))}
    </div>
  );
};

export default ButtonShadow;
