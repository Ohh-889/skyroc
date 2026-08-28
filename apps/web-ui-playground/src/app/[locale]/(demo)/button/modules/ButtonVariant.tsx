'use client';

import { Button } from '@skyroc/web-ui';

const colors = ['primary', 'destructive', 'success', 'warning', 'info', 'carbon', 'secondary', 'accent'] as const;
const variants = ['solid', 'pure', 'plain', 'outline', 'dashed', 'soft', 'ghost', 'link'] as const;

const ButtonVariant = () => {
  return (
    <div className="flex-c-stretch gap-[12px]">
      {colors.map(color => (
        <div
          className="flex flex-wrap gap-[12px]"
          key={color}
        >
          {variants.map(variant => (
            <Button
              color={color}
              key={variant}
              variant={variant}
            >
              {variant}
            </Button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ButtonVariant;
