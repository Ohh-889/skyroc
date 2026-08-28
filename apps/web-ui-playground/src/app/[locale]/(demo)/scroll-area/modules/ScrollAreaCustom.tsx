'use client';

import { ScrollArea } from '@skyroc/web-ui';

const ScrollAreaCustom = () => {
  return (
    <ScrollArea
      className="h-64 w-72 rounded-md border"
      classNames={{
        scrollbar: 'bg-muted/60',
        thumb: 'bg-primary'
      }}
    >
      <div className="space-y-3 p-4">
        {Array.from({ length: 24 }).map((_, index) => (
          <div
            className="rounded-md border p-3"
            key={index}
          >
            <div className="text-sm font-medium">Message {index + 1}</div>
            <p className="text-muted-foreground mt-1 text-xs">
              Custom scrollbar styling keeps the content area visually aligned with the current theme.
            </p>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default ScrollAreaCustom;
