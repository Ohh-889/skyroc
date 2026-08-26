import { Drawer } from 'vaul';
import { DialogDescription } from '../dialog';
import type { BottomSheetDescriptionProps } from './types';

const BottomSheetDescription = (props: BottomSheetDescriptionProps) => {
  return (
    <DialogDescription
      component={Drawer.Description}
      {...props}
    />
  );
};

export default BottomSheetDescription;
