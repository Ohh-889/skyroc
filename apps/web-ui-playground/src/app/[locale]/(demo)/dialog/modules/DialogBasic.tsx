'use client';

import { Button, Dialog } from '@skyroc/web-ui';

const DialogBasic = () => {
  return (
    <Dialog
      description="Dialog Description"
      title="Dialog Title"
      trigger={<Button variant="plain">Open</Button>}
    >
      <div>Dialog Content</div>
    </Dialog>
  );
};

export default DialogBasic;
