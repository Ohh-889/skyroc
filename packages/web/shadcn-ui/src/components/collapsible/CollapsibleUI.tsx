'use client';

import type { ComponentRef } from 'react';
import { forwardRef } from 'react';
import CollapsibleContent from './CollapsibleContent';
import CollapsibleRoot from './CollapsibleRoot';
import type { CollapsibleProps } from './types';

const CollapsibleUI = forwardRef<ComponentRef<typeof CollapsibleRoot>, CollapsibleProps>((props, ref) => {
  const { children, className, classNames, content, forceMountContent, ...rest } = props;

  return (
    <CollapsibleRoot
      className={className || classNames?.root}
      ref={ref}
      {...rest}
    >
      {children}

      <CollapsibleContent
        className={classNames?.content}
        forceMount={forceMountContent}
      >
        {content}
      </CollapsibleContent>
    </CollapsibleRoot>
  );
});

CollapsibleUI.displayName = 'CollapsibleUI';

export default CollapsibleUI;