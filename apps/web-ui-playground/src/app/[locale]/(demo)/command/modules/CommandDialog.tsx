'use client';

import { Button, Card, Command, CommandDialog, Kbd } from '@skyroc/web-ui';
import type { CommandProps } from '@skyroc/web-ui';
import { Calendar, HelpCircle, Mail, Rocket, Settings, Smile, User } from 'lucide-react';
import { useState } from 'react';

const items: CommandProps['items'] = [
  {
    children: [
      {
        label: 'Calendar',
        leading: <Calendar />,
        value: 'calendar'
      },
      {
        label: 'Search Emoji',
        leading: <Smile />,
        value: 'search-emoji'
      },
      {
        label: 'Launch',
        leading: <Rocket />,
        value: 'launch'
      }
    ],
    label: 'Suggestions'
  },
  { type: 'separator' },
  {
    children: [
      {
        label: 'Profile',
        leading: <User />,
        shortcut: ['command', 'p'],
        value: 'profile'
      },
      {
        label: 'Mail',
        leading: <Mail />,
        shortcut: ['command', 'm'],
        value: 'mail'
      },
      {
        label: 'Settings',
        leading: <Settings />,
        shortcut: ['command', 's'],
        value: 'settings'
      }
    ],
    label: 'Settings'
  },
  { alwaysRender: true, type: 'separator' },
  {
    label: 'Help',
    leading: <HelpCircle />,
    shortcut: ['command', 'h'],
    value: 'help'
  }
];

const CommandDialogDemo = () => {
  const [open, setOpen] = useState(false);

  return (
    <Card
      split
      title="Dialog Command"
    >
      <div className="flex items-center gap-3">
        <Button onClick={() => setOpen(true)}>Open command</Button>
        <Kbd value={['command', 'j']} />
      </div>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
      >
        <Command
          empty="No option found"
          inputProps={{ placeholder: 'Type a command or search...' }}
          items={items}
        />
      </CommandDialog>
    </Card>
  );
};

export default CommandDialogDemo;
