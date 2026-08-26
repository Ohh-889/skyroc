import { Drawer } from 'vaul';
import { DialogClose } from '../dialog';
import type { BottomSheetCloseProps } from './types';

const BottomSheetClose = (props: BottomSheetCloseProps) => {
  return (
    <DialogClose
      component={Drawer.Close}
      {...props}
    />
  );
};

export default BottomSheetClose;
