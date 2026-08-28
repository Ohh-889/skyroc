'use client';

import { Card } from '@skyroc/web-ui';

const sizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;

const CardSize = () => {
  return (
    <div className="flex flex-col gap-4">
      {sizes.map(size => (
        <Card
          split
          key={size}
          size={size}
          title={`Size: ${size}`}
        >
          <p className="text-muted-foreground">Card content</p>
        </Card>
      ))}
    </div>
  );
};

export default CardSize;
