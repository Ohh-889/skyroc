'use client';

import { Button, Card, Tooltip } from '@skyroc/web-ui';

const TooltipBasic = () => {
  return (
    <Card
      split
      title="Basic"
    >
      <Tooltip content="Save your changes">
        <Button variant="plain">Hover me</Button>
      </Tooltip>
    </Card>
  );
};

export default TooltipBasic;
