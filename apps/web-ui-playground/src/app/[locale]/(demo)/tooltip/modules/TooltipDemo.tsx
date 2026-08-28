'use client';

import type { TooltipAlign, TooltipSide } from '@skyroc/web-ui';
import { Button, Card, Tooltip } from '@skyroc/web-ui';

const sides: TooltipSide[] = ['top', 'right', 'bottom', 'left'];

const aligns: TooltipAlign[] = ['start', 'center', 'end'];

const TooltipDemo = () => {
  return (
    <Card
      split
      title="Tooltip Position"
    >
      {sides.map(side => {
        return (
          <div key={side}>
            <div className="py-[12px] text-[18px] font-medium">
              Side:
              {side}
            </div>

            <div className="flex flex-wrap gap-[12px]">
              {aligns.map(align => {
                return (
                  <Tooltip
                    content="Tooltip content"
                    key={align}
                    contentProps={{
                      align,
                      side
                    }}
                  >
                    <Button variant="plain">
                      align:
                      {align}
                    </Button>
                  </Tooltip>
                );
              })}
            </div>
          </div>
        );
      })}
    </Card>
  );
};

export default TooltipDemo;
