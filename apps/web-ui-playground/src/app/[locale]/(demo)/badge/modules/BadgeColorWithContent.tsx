'use client';

import { Badge, Button } from '@skyroc/web-ui';

const colors = ['primary', 'destructive', 'success', 'warning', 'info', 'carbon', 'secondary', 'accent'] as const;

const BadgeColorWithContent = () => {
  return (
    <div className="flex flex-wrap gap-4">
      {colors.map(color => (
        <Badge
          color={color}
          content="99+"
          key={color}
        >
          <Button variant="dashed">{color}</Button>
        </Badge>
      ))}
    </div>
  );
};

export default BadgeColorWithContent;
