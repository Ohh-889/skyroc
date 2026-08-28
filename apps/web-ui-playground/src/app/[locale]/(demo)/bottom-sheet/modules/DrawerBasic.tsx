'use client';

import { BottomSheet, BottomSheetClose, Button } from '@skyroc/web-ui';

const BottomSheetBasic = () => {
  return (
    <BottomSheet
      showClose
      title="BottomSheet Title"
      trigger={<Button variant="outline">Open BottomSheet</Button>}
      classNames={{
        contentBody: 'mx-auto max-w-sm w-full'
      }}
      footer={
        <>
          <BottomSheetClose asChild>
            <Button variant="plain">Cancel</Button>
          </BottomSheetClose>

          <Button>Submit</Button>
        </>
      }
    >
      <p>This is a basic drawer with a title and description.</p>
    </BottomSheet>
  );
};

export default BottomSheetBasic;
