'use client';

import type { TooltipProps } from '@skyroc/web-ui';
import { Button, Card, Tooltip } from '@skyroc/web-ui';

const sizes: TooltipProps['size'][] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];

const TooltipSize = () => {
  return (
    <Card
      split
      title="Size"
    >
      <div className="flex flex-wrap gap-3">
        {sizes.map(size => (
          <Tooltip
            key={size}
            size={size}
            showArrow
            content={`Size: ${size}`}
          >
            <Button
              size={size}
              variant="plain"
            >
              {size}
            </Button>
          </Tooltip>
        ))}
      </div>
    </Card>
  );
};

export default TooltipSize;
