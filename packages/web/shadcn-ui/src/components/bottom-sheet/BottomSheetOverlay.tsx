import { Overlay as _Overlay } from 'vaul';
import { DialogOverlay } from '../dialog';
import type { BottomSheetOverlayProps } from './types';

const BottomSheetOverlay = (props: BottomSheetOverlayProps) => {
  return (
    <DialogOverlay
      component={_Overlay}
      {...props}
    />
  );
};

export default BottomSheetOverlay;
