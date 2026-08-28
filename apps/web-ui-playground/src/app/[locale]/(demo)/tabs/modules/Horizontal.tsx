'use client';

import type { TabsOptionData } from '@skyroc/web-ui';
import { Tabs } from '@skyroc/web-ui';
import { useState } from 'react';

const tabs = [
  {
    children: 'The Tab Content: Tab 1',
    label: 'Tab 1',
    value: '1'
  },
  {
    children: 'The Tab Content: Tab 2',
    label: 'Tab 2',
    value: '2'
  },
  {
    children: 'The Tab Content: Tab 3',
    label: 'Tab 3',
    value: '3'
  }
] satisfies TabsOptionData[];

const Horizontal = () => {
  const [value, setValue] = useState('1');

  return (
    <div className="lt-sm:w-auto w-[320px]">
      <Tabs
        classNames={{ content: 'p-4 border border-border rounded-1' }}
        items={tabs}
        value={value}
        onValueChange={setValue}
      />
    </div>
  );
};

export default Horizontal;
