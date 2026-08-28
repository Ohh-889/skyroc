'use client';

import { AlertDialog, Button } from '@skyroc/web-ui';
import React from 'react';

const AlertDialogDestructive = () => {
  return (
    <AlertDialog
      description="This action will delete all data"
      okButtonProps={{ color: 'destructive' }}
      title="Are you sure delete?"
      type="destructive"
      trigger={
        <Button
          color="destructive"
          variant="outline"
        >
          Show Dialog
        </Button>
      }
    />
  );
};

export default AlertDialogDestructive;
