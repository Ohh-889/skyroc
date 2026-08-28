'use client';

import type { ThemeSize } from '@skyroc/web-ui';
import { Card, Textarea } from '@skyroc/web-ui';

const sizes: ThemeSize[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];

const TextareaSize = () => {
  return (
    <Card
      split
      title="Size"
    >
      <div className="flex-c-stretch gap-3">
        {sizes.map(size => (
          <Textarea
            defaultValue={`Size: ${size}`}
            key={size}
            size={size}
          />
        ))}
      </div>
    </Card>
  );
};

export default TextareaSize;
