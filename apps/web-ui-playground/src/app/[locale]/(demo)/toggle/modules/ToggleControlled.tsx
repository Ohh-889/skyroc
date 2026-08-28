'use client';

import { Card, Toggle } from '@skyroc/web-ui';
import { Bold } from 'lucide-react';
import { useState } from 'react';

const ToggleControlled = () => {
  const [pressed, setPressed] = useState(false);

  return (
    <Card
      split
      title="Controlled"
    >
      <div className="flex items-center gap-3">
        <Toggle
          pressed={pressed}
          variant="outline"
          aria-label="Toggle bold"
          onPressedChange={setPressed}
        >
          <Bold className="size-4" />
        </Toggle>
        <span className="text-sm text-muted-foreground">{pressed ? 'Pressed' : 'Unpressed'}</span>
      </div>
    </Card>
  );
};

export default ToggleControlled;
