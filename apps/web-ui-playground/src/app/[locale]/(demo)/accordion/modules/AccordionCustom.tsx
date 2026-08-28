'use client';

import { Accordion, Tag } from '@skyroc/web-ui';
import type { AccordionItemData } from '@skyroc/web-ui';
import { Earth, Info, Rocket } from 'lucide-react';

const items: AccordionItemData[] = [
  {
    children: 'Yes. It adheres to the WAI-ARIA design pattern.',
    leading: <Info />,
    title: 'Is it accessible?',
    trailing: <Tag variant="soft">Tag</Tag>,
    value: '1'
  },
  {
    children: "Yes. It's unstyled by default, giving you freedom over the look and feel.",
    leading: <Rocket />,
    title: 'Is it unstyled?',
    value: '2'
  },
  {
    children: 'Yes! You can use the transition prop to configure the animation.',
    leading: <Earth />,
    title: 'Can it be animated?',
    value: '3'
  }
];

const AccordionCustom = () => {
  return (
    <Accordion
      collapsible
      items={items}
      type="single"
      classNames={{
        content: 'px-3 leading-8',
        item: 'border-b-0',
        trigger: `mb-2 rounded-md px-3 text-left underline-offset-2 data-[state=closed]:(bg-muted/50 no-underline) data-[state=open]:(bg-secondary-foreground/20 underline hover:underline) hover:bg-muted`
      }}
    />
  );
};

export default AccordionCustom;
