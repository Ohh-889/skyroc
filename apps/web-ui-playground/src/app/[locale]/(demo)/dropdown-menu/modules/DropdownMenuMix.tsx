'use client';

import { Button, DropdownMenu } from '@skyroc/web-ui';
import { useState } from 'react';

const menus = [
  {
    type: 'label' as const,
    label: 'Menu Options'
  },
  { type: 'item' as const, label: 'Profile', shortcut: '⌘⇧P' },
  { type: 'item' as const, label: 'Billing', shortcut: '⌘B' },
  { type: 'item' as const, label: 'Settings', shortcut: '⌘S' },
  {
    type: 'sub' as const,
    label: 'Invite Users',
    children: [
      { type: 'item' as const, label: 'Email', shortcut: '⌘⇧E' },
      { type: 'item' as const, label: 'Facebook', shortcut: '⌘⇧F' },
      { type: 'item' as const, label: 'Twitter', shortcut: '⌘⇧T' },
      { type: 'separator' as const },
      {
        type: 'sub' as const,
        label: 'More',
        children: [{ type: 'item' as const, label: 'Message', shortcut: '⌘M' }]
      }
    ]
  },
  { type: 'separator' as const },
  { type: 'label' as const, label: 'JS Frameworks' }
];

const checkboxItems = [
  { label: 'Vue', value: 'vue' },
  { label: 'React', value: 'react' },
  { label: 'Angular', value: 'angular' },
  { label: 'Svelte', value: 'svelte' },
  { label: 'Solid', value: 'solid' },
  { label: 'Preact', value: 'preact' }
];

const radioItems = [
  { label: 'Top', value: 'top' },
  { label: 'Right', value: 'right' },
  { label: 'Bottom', value: 'bottom' },
  { label: 'Left', value: 'left' }
];

const DropdownMenuMix = () => {
  const [checks, setChecks] = useState<string[]>(['vue', 'solid']);
  const [side, setSide] = useState('top');

  return (
    <DropdownMenu
      items={[
        ...menus,
        {
          type: 'checkbox',
          checks,
          onChecksChange: setChecks,
          children: checkboxItems
        },
        { type: 'separator' },
        { type: 'label', label: 'Side' },
        {
          type: 'radio',
          value: side,
          onValueChange: setSide,
          children: radioItems
        }
      ]}
    >
      <Button variant="plain">Open Mix Dropdown</Button>
    </DropdownMenu>
  );
};

export default DropdownMenuMix;
