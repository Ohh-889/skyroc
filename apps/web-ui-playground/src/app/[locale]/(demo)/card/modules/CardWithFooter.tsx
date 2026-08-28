'use client';

import { Card } from '@skyroc/web-ui';

const CardWithFooter = () => {
  return (
    <Card
      footer="Card Footer"
      title="Card Title"
    >
      <p className="text-muted-foreground">This card has a footer section.</p>
    </Card>
  );
};

export default CardWithFooter;
