'use client';

import { Button } from '@skyroc/web-ui';
import { Minus, Plus } from 'lucide-react';

const ButtonSlot = () => {
  return (
    <div className="flex flex-wrap gap-[12px]">
      <Button
        color="primary"
        leading={<Plus />}
      >
        leading
      </Button>

      <Button
        color="destructive"
        trailing={<Minus />}
        variant="outline"
      >
        After
      </Button>

      <Button
        color="success"
        leading={<Plus />}
        trailing={<Minus />}
        variant="dashed"
      >
        Both
      </Button>
    </div>
  );
};

export default ButtonSlot;
