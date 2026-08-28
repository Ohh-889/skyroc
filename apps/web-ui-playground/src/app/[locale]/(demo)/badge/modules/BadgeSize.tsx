'use client';

import { Badge, Button } from '@skyroc/web-ui';

const sizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;

const BadgeSize = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end gap-3">
        {sizes.map(size => (
          <Badge
            key={size}
            size={size}
          >
            <Button
              size={size}
              variant="soft"
            >
              {size}
            </Button>
          </Badge>
        ))}
      </div>

      <div className="flex flex-wrap items-end gap-3">
        {sizes.map(size => (
          <Badge
            content="99+"
            key={size}
            size={size}
          >
            <Button
              size={size}
              variant="soft"
            >
              {size}
            </Button>
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default BadgeSize;
