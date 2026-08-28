'use client';

import { Button, ButtonIcon } from '@skyroc/web-ui';
import { Minus, Plus } from 'lucide-react';

const ButtonShape = () => {
  return (
    <div className="flex flex-wrap gap-[12px]">
      <Button
        color="primary"
        shape="rounded"
        variant="solid"
      >
        rounded
      </Button>

      <div className="flex-c-center">
        <Button
          fitContent
          color="destructive"
          shape="square"
          variant="plain"
        >
          <Minus />
        </Button>

        <div className="text-[12px] text-[#666]">square</div>
      </div>

      <div className="flex-c-center">
        <Button
          fitContent
          color="success"
          shape="circle"
          variant="outline"
        >
          <Plus />
        </Button>

        <div className="text-[12px] text-[#666]">circle</div>
      </div>

      <div className="flex-c-center">
        <Button
          fitContent
          color="warning"
          shape="square"
          variant="dashed"
        >
          <Plus />
        </Button>

        <div className="text-[12px] text-[#666]">square</div>
      </div>

      <div className="flex-c-center">
        <ButtonIcon shape="circle">
          <Minus />
        </ButtonIcon>

        <div className="text-[12px] text-[#666]">circle</div>
      </div>
    </div>
  );
};

export default ButtonShape;
