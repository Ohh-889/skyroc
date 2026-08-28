'use client';

import { Button } from '@skyroc/web-ui';
import { Loader } from 'lucide-react';

const ButtonLoading = () => {
  return (
    <div className="flex flex-wrap gap-[12px]">
      <Button
        loading
        color="success"
        variant="solid"
      >
        Loading...
      </Button>

      <Button
        loading
        color="warning"
        leading={<Loader className="animate-spin" />}
        variant="outline"
      >
        Loading...
      </Button>
    </div>
  );
};

export default ButtonLoading;
