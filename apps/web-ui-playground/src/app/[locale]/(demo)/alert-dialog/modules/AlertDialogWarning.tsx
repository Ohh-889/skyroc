'use client';

import { AlertDialog, Button } from '@skyroc/web-ui';
import React from 'react';

const AlertDialogWarning = () => {
  return (
    <AlertDialog
      description="Be careful with this action"
      title="Warning"
      type="warning"
      trigger={
        <Button
          color="warning"
          variant="outline"
        >
          Show Dialog
        </Button>
      }
    />
  );
};

export default AlertDialogWarning;
