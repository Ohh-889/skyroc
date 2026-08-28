'use client';

import type { ToggleGroupProps } from '@skyroc/web-ui';
import { Card, ToggleGroup } from '@skyroc/web-ui';

const sizes: ToggleGroupProps['size'][] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];

const items: ToggleGroupProps['items'] = [
  { label: 'A', value: 'a' },
  { label: 'B', value: 'b' },
  { label: 'C', value: 'c' }
];

const ToggleGroupSize = () => {
  return (
    <Card
      split
      title="Size"
    >
      <div className="flex flex-col items-start gap-3">
        {sizes.map(size => (
          <ToggleGroup
            key={size}
            items={items}
            size={size}
            type="single"
            defaultValue="a"
            variant="outline"
          />
        ))}
      </div>
    </Card>
  );
};

export default ToggleGroupSize;
