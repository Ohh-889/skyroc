'use client';

import { AlertDialog, Button } from '@skyroc/web-ui';
import React from 'react';

const AlertDialogInformation = () => {
  return (
    <AlertDialog
      description="Here is some information for you"
      showCancel={false}
      title="Information"
      type="info"
      trigger={
        <Button
          color="info"
          variant="outline"
        >
          Show Dialog
        </Button>
      }
    />
  );
};

export default AlertDialogInformation;
