'use client';

import { Avatar, Button, Card, HoverCard } from '@skyroc/web-ui';

const HoverCardDefaultDemo = () => {
  return (
    <Card
      split
      title="Default"
    >
      <HoverCard
        classNames={{ content: 'w-64' }}
        trigger={<Button variant="link">@skyroc</Button>}
      >
        <div className="flex justify-between space-x-4">
          <Avatar
            fallback="VC"
            src="/icon.svg"
          />

          <div className="space-y-1">
            <h4 className="text-sm font-semibold">@skyroc</h4>
            <p className="text-sm">Skyroc is a front-end technology team, built by Skyroc.</p>
          </div>
        </div>
      </HoverCard>
    </Card>
  );
};

export default HoverCardDefaultDemo;
