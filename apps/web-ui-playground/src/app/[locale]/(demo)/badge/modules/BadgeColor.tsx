'use client';

import { Badge, Button } from '@skyroc/web-ui';

const colors = ['primary', 'destructive', 'success', 'warning', 'info', 'carbon', 'secondary', 'accent'] as const;

const BadgeColor = () => {
  return (
    <div className="flex flex-wrap gap-3">
      {colors.map(color => (
        <Badge
          color={color}
          key={color}
        >
          <Button variant="dashed">{color}</Button>
        </Badge>
      ))}
    </div>
  );
};

export default BadgeColor;
