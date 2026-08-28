'use client';

import { Button, Popover } from '@skyroc/web-ui';

const sizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;

const PopoverSize = () => {
  return (
    <div className="flex flex-wrap gap-3">
      {sizes.map(size => (
        <Popover
          showArrow
          key={size}
          size={size}
          trigger={<Button variant="plain">{size}</Button>}
        >
          <div className="w-48">
            <h4 className="font-medium">{size} popover</h4>
            <p className="text-muted-foreground mt-1 text-sm">Size changes padding, text size, and arrow scale.</p>
          </div>
        </Popover>
      ))}
    </div>
  );
};

export default PopoverSize;
