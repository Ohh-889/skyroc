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

const Custom = () => {
  const [value1, setValue1] = useState('1');
  const [value2, setValue2] = useState('1');

  return (
    <div className="flex-c gap-8">
      {/* Horizontal Line Type */}
      <div className="flex-c gap-4">
        <h3 className="text-base font-semibold">Line Type</h3>

        <div className="lt-sm:w-auto w-80">
          <Tabs
            fill="full"
            items={tabs}
            type="line"
            value={value1}
            classNames={{
              content: 'p-4 border border-border rounded-1'
            }}
            onValueChange={setValue1}
          />
        </div>
      </div>

      {/* Vertical Line Type */}
      <div className="flex-c gap-4">
        <h3 className="text-base font-semibold">Line Type Vertical</h3>

        <div className="lt-sm:w-auto w-80">
          <Tabs
            items={tabs}
            orientation="vertical"
            type="line"
            value={value2}
            classNames={{
              content: 'p-4 border border-border rounded-1'
            }}
            onValueChange={setValue2}
          />
        </div>
      </div>
    </div>
  );
};

export default Custom;
