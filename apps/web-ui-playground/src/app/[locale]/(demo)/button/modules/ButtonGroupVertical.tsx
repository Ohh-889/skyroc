'use client';

import { ButtonGroup, ButtonIcon } from '@skyroc/web-ui';
import { Pause, SkipBack, SkipForward } from 'lucide-react';

const ButtonGroupVertical = () => {
  return (
    <div className="w-[100px]">
      <ButtonGroup orientation="vertical">
        <ButtonIcon variant="dashed">
          <SkipBack />
        </ButtonIcon>

        <ButtonIcon variant="dashed">
          <Pause />
        </ButtonIcon>

        <ButtonIcon variant="dashed">
          <SkipForward />
        </ButtonIcon>
      </ButtonGroup>
    </div>
  );
};

export default ButtonGroupVertical;
