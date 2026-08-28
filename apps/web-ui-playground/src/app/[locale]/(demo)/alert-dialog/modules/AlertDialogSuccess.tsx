'use client';

import { AlertDialog, Button } from '@skyroc/web-ui';
import React from 'react';

const AlertDialogSuccess = () => {
  return (
    <AlertDialog
      description="You have successfully completed the task"
      showCancel={false}
      title="Congratulations"
      type="success"
      trigger={
        <Button
          color="success"
          variant="outline"
        >
          Show Dialog
        </Button>
      }
    />
  );
};

export default AlertDialogSuccess;
