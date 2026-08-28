'use client';

import type { TabsOptionData } from '@skyroc/web-ui';
import { Tabs } from '@skyroc/web-ui';
import { useState } from 'react';

const tabs = [
  {
    children: <div>Tab 1</div>,
    label: 'Tab 1',
    value: '1'
  },
  {
    children: <div>Tab 2</div>,
    label: 'Tab 2',
    value: '2'
  },
  {
    children: <div>Tab 3</div>,
    label: 'Tab 3',
    value: '3'
  }
] satisfies TabsOptionData[];

const Fill = () => {
  const [value, setValue] = useState('1');

  return (
    <div className="flex-c gap-4">
      <p className="text-muted-foreground text-sm">TabsList width is controlled by the content width</p>

      <div className="lt-sm:w-auto w-[320px]">
        <Tabs
          classNames={{ content: 'p-4 border border-border rounded-1' }}
          fill="auto"
          items={tabs}
          value={value}
          onValueChange={setValue}
        />
      </div>
    </div>
  );
};

export default Fill;
