'use client';

import { Button, DropdownMenuRadio } from '@skyroc/web-ui';
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

const DropdownMenuRadioDemo = () => {
  const [placement, setPlacement] = useState('top-start');

  const activeLabel = placements.find(item => 'value' in item && item.value === placement)?.label;

  return (
    <DropdownMenuRadio
      items={placements}
      value={placement}
      onValueChange={setPlacement}
    >
      <Button
        className="w-30"
        variant="plain"
      >
        {activeLabel}
      </Button>
    </DropdownMenuRadio>
  );
};

export default DropdownMenuRadioDemo;
