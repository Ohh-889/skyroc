'use client';

import { ButtonIcon } from '@skyroc/web-ui';
import { Pause, SkipBack, SkipForward } from 'lucide-react';

const ButtonIconBasic = () => {
  return (
    <div className="flex flex-wrap gap-[12px]">
      <ButtonIcon>
        <SkipBack />
      </ButtonIcon>

      <ButtonIcon>
        <SkipForward />
      </ButtonIcon>

      <ButtonIcon>
        <Pause />
      </ButtonIcon>
    </div>
  );
};

export default ButtonIconBasic;
