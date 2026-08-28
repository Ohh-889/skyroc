'use client';

import { Menubar } from '@skyroc/web-ui';
import { useState } from 'react';

const fileMenu = [
  { label: 'New Tab', shortcut: '⌘T' },
  { label: 'New Window', shortcut: '⌘N' },
  { label: 'New Incognito Window', disabled: true },
  { type: 'separator' as const },
  {
    type: 'sub' as const,
    label: 'Share',
    children: [{ label: 'Email link' }, { label: 'Messages' }, { label: 'Notes' }]
  },
  { type: 'separator' as const },
  { label: 'Print...', shortcut: '⌘P' }
];

const editMenu = [
  { label: 'Undo', shortcut: '⌘Z' },
  { label: 'Redo', shortcut: '⇧⌘Z' },
  { type: 'separator' as const },
  {
    type: 'sub' as const,
    label: 'Find',
    children: [
      { label: 'Search the web' },
      { type: 'separator' as const },
      { label: 'Find...' },
      { label: 'Find Next' },
      { label: 'Find Previous' }
    ]
  },
  { type: 'separator' as const },
  { label: 'Cut' },
  { label: 'Copy' },
  { label: 'Paste' }
];

const viewCheckboxItems = [
  { label: 'Always Show Bookmarks Bar', value: 'bookmarks' },
  { label: 'Always Show Full URLs', value: 'urls' },
  { type: 'separator' as const },
  { label: 'Toggle Fullscreen', value: 'fullscreen' },
  { label: 'Hide Sidebar', value: 'sidebar' }
];

const profileRadioItems = [
  { label: 'Andy', value: 'andy' },
  { label: 'Benoit', value: 'benoit' },
  { label: 'Luis', value: 'luis' }
];

const MenubarBasic = () => {
  const [checks, setChecks] = useState<string[]>(['bookmarks']);
  const [person, setPerson] = useState('benoit');

  return (
    <Menubar
      items={[
        { label: 'File', children: fileMenu },
        { label: 'Edit', children: editMenu },
        {
          label: 'View',
          type: 'checkbox',
          checks,
          onChecksChange: setChecks,
          children: viewCheckboxItems
        },
        {
          label: 'Profiles',
          type: 'radio',
          value: person,
          onValueChange: setPerson,
          children: profileRadioItems
        }
      ]}
    />
  );
};

export default MenubarBasic;
