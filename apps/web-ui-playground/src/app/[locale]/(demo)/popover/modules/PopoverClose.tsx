'use client';

import { Button, Popover } from '@skyroc/web-ui';
import { X } from 'lucide-react';

const PopoverClose = () => {
  return (
    <Popover
      closeIcon={
        <Button
          className="absolute right-2 top-2"
          size="xs"
          variant="ghost"
        >
          <X className="size-4" />
        </Button>
      }
      trigger={<Button variant="plain">Open with close</Button>}
    >
      <div className="w-64 space-y-2 pr-8">
        <h4 className="font-medium">Closable Popover</h4>

        <p className="text-muted-foreground text-sm">Click the close button in the corner to dismiss this popover.</p>
      </div>
    </Popover>
  );
};

export default PopoverClose;
