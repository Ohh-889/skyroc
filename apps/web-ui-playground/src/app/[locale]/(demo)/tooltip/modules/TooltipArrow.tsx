'use client';

import { Button, Card, Tooltip } from '@skyroc/web-ui';

const TooltipArrow = () => {
  return (
    <Card
      split
      title="Tooltip Arrow"
    >
      <Tooltip
        showArrow
        content="Tooltip content"
      >
        <Button variant="plain">with arrow</Button>
      </Tooltip>
    </Card>
  );
};

export default TooltipArrow;
