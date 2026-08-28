'use client';

import type { ScrollAreaProps } from '@skyroc/web-ui';
import { ScrollArea } from '@skyroc/web-ui';

const sizes: ScrollAreaProps['size'][] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];

const ScrollAreaSize = () => {
  return (
    <div className="flex flex-wrap gap-4">
      {sizes.map(size => (
        <ScrollArea
          className="h-32 w-36 rounded-md border"
          key={size}
          size={size}
        >
          <div className="space-y-2 p-3">
            {Array.from({ length: 12 }).map((_, index) => (
              <div
                className="bg-muted rounded px-2 py-1 text-sm"
                key={`${size}-${index}`}
              >
                {size}
                {' '}
                item
                {' '}
                {index + 1}
              </div>
            ))}
          </div>
        </ScrollArea>
      ))}
    </div>
  );
};

export default ScrollAreaSize;
