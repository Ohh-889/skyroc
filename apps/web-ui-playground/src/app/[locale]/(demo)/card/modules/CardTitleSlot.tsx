'use client';

import { Card, Tag } from '@skyroc/web-ui';
import { Rocket } from 'lucide-react';

const CardTitleSlot = () => {
  return (
    <Card
      split
      title="Title with Slots"
      titleLeading={<Rocket className="size-4" />}
      titleTrailing={<Tag variant="soft">New</Tag>}
    >
      <p className="text-muted-foreground">Use titleLeading and titleTrailing to add content before/after the title.</p>
    </Card>
  );
};

export default CardTitleSlot;
