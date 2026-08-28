'use client';

import { Button, Popover } from '@skyroc/web-ui';
import { useState } from 'react';

const PopoverControlled = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center gap-4">
      <Popover
        open={open}
        trigger={<Button>Controlled Popover</Button>}
        onOpenChange={setOpen}
      >
        <div className="space-y-2">
          <h4 className="font-medium">Controlled Popover</h4>

          <p className="text-muted-foreground mb-4 text-sm">This popover is controlled by external state.</p>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Close
          </Button>
        </div>
      </Popover>

      <Button
        size="sm"
        variant="ghost"
        onClick={() => setOpen(!open)}
      >
        Toggle from outside
      </Button>
    </div>
  );
};

export default PopoverControlled;
