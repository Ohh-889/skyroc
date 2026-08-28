'use client';

import { Badge, Button } from '@skyroc/web-ui';

const BadgeBasic = () => {
  return (
    <div className="flex flex-wrap gap-4">
      <Badge>
        <Button variant="dashed">Dot</Button>
      </Badge>

      <Badge content="5">
        <Button variant="dashed">Count</Button>
      </Badge>

      <Badge content="99+">
        <Button variant="dashed">Max</Button>
      </Badge>
    </div>
  );
};

export default BadgeBasic;
