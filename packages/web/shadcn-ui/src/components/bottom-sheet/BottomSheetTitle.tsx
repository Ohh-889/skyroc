import { Drawer } from 'vaul';
import { DialogTitle } from '../dialog';
import type { BottomSheetTitleProps } from './types';

const BottomSheetTitle = (props: BottomSheetTitleProps) => {
  return (
    <DialogTitle
      component={Drawer.Title}
      {...props}
    />
  );
};

export default BottomSheetTitle;
