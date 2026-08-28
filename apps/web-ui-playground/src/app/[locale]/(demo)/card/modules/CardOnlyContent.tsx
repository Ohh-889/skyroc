'use client';

import { Card } from '@skyroc/web-ui';

const CardOnlyContent = () => {
  return (
    <Card>
      <p className="text-muted-foreground">A simple card with only content, no header or footer.</p>
    </Card>
  );
};

export default CardOnlyContent;
