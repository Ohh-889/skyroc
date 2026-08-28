'use client';

import type { ComponentRef } from 'react';
import { forwardRef } from 'react';
import type { Content } from 'vaul';
import BottomSheetUI from '../../components/bottom-sheet/BottomSheetUI';
import type { BottomSheetProps } from '../../components/bottom-sheet/types';
import { useComponentConfig } from '../config-provider/context';

const BottomSheet = forwardRef<ComponentRef<typeof Content>, BottomSheetProps>((props, ref) => {
  const config = useComponentConfig('bottomSheet');

  const mergedProps = {
    ...config,
    ...props
  };

  return (
    <BottomSheetUI
      {...mergedProps}
      ref={ref}
    />
  );
});

BottomSheet.displayName = 'BottomSheet';

export default BottomSheet;
