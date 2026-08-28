'use client';

import { Button, Popover } from '@skyroc/web-ui';

const PopoverBasic = () => {
  return (
    <Popover trigger={<Button variant="plain">Open Popover</Button>}>
      <div className="space-y-2">
        <h4 className="font-medium">Popover Title</h4>

        <p className="text-muted-foreground text-sm">This is a basic popover content. You can put any content here.</p>
      </div>
    </Popover>
  );
};

export default PopoverBasic;
