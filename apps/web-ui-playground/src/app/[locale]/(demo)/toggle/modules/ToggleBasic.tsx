'use client';

import { Card, Toggle } from '@skyroc/web-ui';
import { Bold } from 'lucide-react';

const ToggleBasic = () => {
  return (
    <Card
      split
      title="Basic"
    >
      <Toggle aria-label="Toggle bold">
        <Bold className="size-4" />
      </Toggle>
    </Card>
  );
};

export default ToggleBasic;
