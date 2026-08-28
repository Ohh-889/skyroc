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

const AccordionSlot = () => {
  return (
    <Accordion
      collapsible
      items={items}
      type="single"
    />
  );
};

export default AccordionSlot;
