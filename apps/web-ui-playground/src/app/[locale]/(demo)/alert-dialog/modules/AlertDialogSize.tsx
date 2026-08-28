'use client';

import { AlertDialog, Button } from '@skyroc/web-ui';
import React from 'react';

const sizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;

const AlertDialogSize = () => {
  return (
    <div className="flex flex-wrap gap-[12px]">
      {sizes.map(size => (
        <AlertDialog
          description="Dialog content goes here"
          key={size}
          size={size}
          title="Dialog Title"
          type="info"
          trigger={
            <Button
              color="info"
              variant="outline"
            >
              {size}
            </Button>
          }
        />
      ))}
    </div>
  );
};

export default AlertDialogSize;
