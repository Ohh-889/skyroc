'use client';

import { Button, Dialog, DialogClose } from '@skyroc/web-ui';

const DialogWithFooter = () => {
  return (
    <Dialog
      description="Dialog with footer buttons"
      title="Confirm Action"
      trigger={<Button variant="plain">With Footer</Button>}
      footer={
        <>
          <DialogClose asChild>
            <Button variant="plain">Cancel</Button>
          </DialogClose>

          <Button>Confirm</Button>
        </>
      }
    >
      <div>Are you sure you want to proceed?</div>
    </Dialog>
  );
};

export default DialogWithFooter;
