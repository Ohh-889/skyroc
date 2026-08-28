'use client';

import { Button, Popover } from '@skyroc/web-ui';

const placements = ['top', 'right', 'bottom', 'left'] as const;

const PopoverPlacement = () => {
  return (
    <div className="flex flex-wrap gap-4">
      {placements.map(placement => (
        <Popover
          showArrow
          key={placement}
          side={placement}
          trigger={<Button variant="plain">{placement}</Button>}
        >
          <div className="space-y-2">
            <h4 className="font-medium capitalize">{placement} Placement</h4>

            <p className="text-muted-foreground text-sm">This popover is placed on the {placement}.</p>
          </div>
        </Popover>
      ))}
    </div>
  );
};

export default PopoverPlacement;
