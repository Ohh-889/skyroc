'use client';

import { Button } from '@skyroc/web-ui';

const ButtonDisabled = () => {
  return (
    <div className="flex flex-wrap gap-[12px]">
      <Button
        disabled
        color="destructive"
        variant="solid"
      >
        disabled
      </Button>

      <Button
        disabled
        color="success"
        variant="outline"
      >
        disabled
      </Button>

      <Button
        disabled
        color="warning"
        variant="dashed"
      >
        disabled
      </Button>
    </div>
  );
};

export default ButtonDisabled;
