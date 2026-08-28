'use client';

import { Badge, Button } from '@skyroc/web-ui';

const positions = ['top-right', 'bottom-right', 'top-left', 'bottom-left'] as const;

const BadgePosition = () => {
  return (
    <div className="flex flex-wrap gap-3">
      {positions.map(position => (
        <Badge
          key={position}
          position={position}
        >
          <Button
            className="w-30"
            variant="dashed"
          >
            {position}
          </Button>
        </Badge>
      ))}
    </div>
  );
};

export default BadgePosition;
