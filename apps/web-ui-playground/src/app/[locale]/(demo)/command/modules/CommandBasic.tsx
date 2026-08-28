'use client';

import { Command } from '@skyroc/web-ui';
import type { CommandProps } from '@skyroc/web-ui';
import { Calendar, HelpCircle, Mail, Rocket, Settings, Smile, User } from 'lucide-react';

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

const CommandBasic = () => {
  return (
    <Command
      className="rounded-lg border shadow-md"
      items={items}
    />
  );
};

export default CommandBasic;
