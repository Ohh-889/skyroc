'use client';

import { Alert, ButtonIcon } from '@skyroc/web-ui';
import { TriangleAlert, X } from 'lucide-react';

const AlertComplete = () => {
  return (
    <Alert
      color="destructive"
      description="Your session has expired. Please log in again."
      icon={<TriangleAlert />}
      title="Error"
      variant="ghost"
      trailing={
        <ButtonIcon
          fitContent={false}
          variant="ghost"
        >
          <X />
        </ButtonIcon>
      }
    />
  );
};

export default AlertComplete;
