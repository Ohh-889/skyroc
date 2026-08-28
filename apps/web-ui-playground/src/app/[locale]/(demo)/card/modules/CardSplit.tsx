'use client';

import { Card } from '@skyroc/web-ui';

const CardSplit = () => {
  return (
    <Card
      split
      footer="Footer with divider"
      title="Split Card"
    >
      <p className="text-muted-foreground">This card has dividers between header, content, and footer.</p>
    </Card>
  );
};

export default CardSplit;
