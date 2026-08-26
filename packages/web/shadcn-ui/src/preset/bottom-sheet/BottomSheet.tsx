'use client';

import type { ComponentRef } from 'react';
import { forwardRef } from 'react';
import type { Content } from 'vaul';
import { useComponentConfig } from '../config-provider/context';
import BottomSheetUI from '../../components/bottom-sheet/BottomSheetUI';
import type { BottomSheetProps } from '../../components/bottom-sheet/types';

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
