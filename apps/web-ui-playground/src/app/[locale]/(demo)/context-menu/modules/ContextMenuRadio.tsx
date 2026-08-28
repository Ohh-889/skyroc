'use client';

import { ContextMenu } from '@skyroc/web-ui';
import { useState } from 'react';

const placements = [
  { type: 'label' as const, label: 'Tooltip Placement' },
  { label: 'Top Start', value: 'top-start' },
  { label: 'Top', value: 'top' },
  { label: 'Top End', value: 'top-end' },
  { label: 'Right Start', value: 'right-start' },
  { label: 'Right', value: 'right' },
  { label: 'Right End', value: 'right-end' },
  { label: 'Bottom Start', value: 'bottom-start' },
  { label: 'Bottom', value: 'bottom' },
  { label: 'Bottom End', value: 'bottom-end' },
  { label: 'Left Start', value: 'left-start' },
  { label: 'Left', value: 'left' },
  { label: 'Left End', value: 'left-end' }
];

const ContextMenuRadioDemo = () => {
  const [placement, setPlacement] = useState('top-start');

  return (
    <ContextMenu
      items={[
        {
          type: 'radio',
          value: placement,
          onValueChange: setPlacement,
          children: placements
        }
      ]}
    >
      <div className="flex h-40 w-80 items-center justify-center rounded-md border border-dashed text-sm max-sm:w-auto">
        Right click here
      </div>
    </ContextMenu>
  );
};

export default ContextMenuRadioDemo;
