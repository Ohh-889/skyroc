'use client';

import type { ToggleProps } from '@skyroc/web-ui';
import { Card, Toggle } from '@skyroc/web-ui';

const sizes: ToggleProps['size'][] = ['sm', 'md', 'lg', 'xl', '2xl'];

const ToggleDemo = () => {
  return (
    <Card
      split
      title="Size"
    >
      <div className="gap-12px flex flex-wrap">
        {sizes.map(size => (
          <Toggle
            key={size}
            size={size}
            variant="ghost"
          >
            {size}
          </Toggle>
        ))}
      </div>
    </Card>
  );
};

export default ToggleDemo;
