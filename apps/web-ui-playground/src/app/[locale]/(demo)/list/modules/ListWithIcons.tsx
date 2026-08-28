'use client';

import { List } from '@skyroc/web-ui';
import { Bell, ChevronRight, MessageCircle, Settings } from 'lucide-react';

const listItems = [
  {
    description: 'You have 3 unread messages.',
    leading: <Bell />,
    title: 'Notifications',
    content: <span className="text-muted-foreground text-xs">This is Content</span>,
    trailing: <ChevronRight />
  },
  {
    description: 'You have 5 new messages.',
    content: <span className="text-muted-foreground text-xs">This is Content</span>,
    leading: <MessageCircle />,
    title: 'Messages',
    trailing: <ChevronRight />
  },
  {
    description: 'Manage your account settings.',
    leading: <Settings />,
    content: <span className="text-muted-foreground text-xs">This is Content</span>,
    title: 'Settings',
    trailing: <ChevronRight />
  }
];

const ListWithIcons = () => {
  return (
    <List
      className="w-80 max-sm:w-full"
      items={listItems}
    />
  );
};

export default ListWithIcons;
