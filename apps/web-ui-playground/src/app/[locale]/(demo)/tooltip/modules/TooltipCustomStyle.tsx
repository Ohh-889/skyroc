'use client';

import { Button, Card, Tooltip } from '@skyroc/web-ui';

const TooltipCustomStyle = () => {
  return (
    <Card
      split
      title="Custom style"
    >
      <Tooltip
        showArrow
        content="Custom tooltip"
        classNames={{
          arrow: 'fill-primary',
          content: 'border-primary bg-primary text-primary-foreground'
        }}
      >
        <Button variant="plain">Custom</Button>
      </Tooltip>
    </Card>
  );
};

export default TooltipCustomStyle;
