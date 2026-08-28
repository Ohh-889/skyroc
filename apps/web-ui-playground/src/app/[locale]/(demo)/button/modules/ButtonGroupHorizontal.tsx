'use client';

import { Button, ButtonGroup } from '@skyroc/web-ui';
import { Pause, SkipBack, SkipForward } from 'lucide-react';

const ButtonGroupHorizontal = () => {
  return (
    <div className="flex flex-wrap gap-[12px]">
      <ButtonGroup>
        <Button variant="outline">
          <SkipBack />
        </Button>

        <Button variant="outline">
          <Pause />
        </Button>

        <Button variant="outline">
          <SkipForward />
        </Button>
      </ButtonGroup>

      <ButtonGroup>
        <Button
          color="destructive"
          variant="outline"
        >
          <SkipBack />
        </Button>

        <Button
          color="destructive"
          variant="outline"
        >
          <SkipForward />
        </Button>
      </ButtonGroup>
    </div>
  );
};

export default ButtonGroupHorizontal;
