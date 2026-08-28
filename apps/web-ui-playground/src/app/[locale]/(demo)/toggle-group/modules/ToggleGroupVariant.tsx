'use client';

import type { ToggleGroupProps } from '@skyroc/web-ui';
import { Card, ToggleGroup } from '@skyroc/web-ui';

const items: ToggleGroupProps['items'] = [
  { label: 'Day', value: 'day' },
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' }
];

const ToggleGroupVariant = () => {
  return (
    <Card
      split
      title="Variant"
    >
      <div className="flex flex-wrap gap-4">
        <ToggleGroup
          items={items}
          type="single"
          defaultValue="day"
          variant="ghost"
        />
        <ToggleGroup
          items={items}
          type="single"
          defaultValue="week"
          variant="outline"
        />
      </div>
    </Card>
  );
};

export default ToggleGroupVariant;
