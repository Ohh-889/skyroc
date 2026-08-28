'use client';

import { Accordion } from '@skyroc/web-ui';
import type { AccordionItemData } from '@skyroc/web-ui';
import { AArrowDownIcon, Earth, Minus, Plus } from 'lucide-react';
import { useState } from 'react';

const items: AccordionItemData[] = [
  {
    children: 'Yes. It adheres to the WAI-ARIA design pattern.',
    title: 'Is it accessible?',
    value: '1'
  },
  {
    children: 'Yes. It adheres to the WAI-ARIA design pattern.',
    title: 'Is it accessible?',
    value: '2'
  },
  {
    children: 'Yes. It adheres to the WAI-ARIA design pattern.',
    leading: <Earth />,
    title: 'Is it accessible?',
    value: '3'
  }
];

const AccordionCustomIcon = () => {
  const [value, setValue] = useState('1');

  return (
    <Accordion
      items={items}
      triggerIcon={<AArrowDownIcon />}
      triggerLeading={<Minus />}
      triggerTrailing={<Plus />}
      type="single"
      value={value}
      onValueChange={setValue}
    />
  );
};

export default AccordionCustomIcon;
