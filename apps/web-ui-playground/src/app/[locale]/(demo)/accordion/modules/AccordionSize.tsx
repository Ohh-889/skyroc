'use client';

import { Accordion, Card, Tag } from '@skyroc/web-ui';
import type { AccordionItemData, ThemeSize } from '@skyroc/web-ui';
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

const sizes: ThemeSize[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];

const AccordionSize = () => {
  return (
    <div className="flex flex-wrap justify-start gap-x-8 gap-y-4">
      {sizes.map(size => (
        <Card
          split
          className="basis-[48%] max-sm:basis-full"
          key={size}
          title={size}
        >
          <Accordion
            collapsible
            items={items}
            size={size}
            type="single"
          />
        </Card>
      ))}
    </div>
  );
};

export default AccordionSize;
