'use client';

import { cn } from '@skyroc/utils';
import { Dialog } from '../dialog';
import DrawerContent from './DrawerContent';
import type { DrawerProps } from './types';

const DrawerUI = (props: DrawerProps) => {
  const { children, scrollable = true, ...rest } = props;

  return (
    <Dialog
      contentComponent={DrawerContent}
      {...rest}
    >
      <div className={cn('flex-grow', scrollable && ' overflow-auto')}>{children}</div>
    </Dialog>
  );
};

export default DrawerUI;
