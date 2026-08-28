'use client';

import type { ToggleGroupProps } from '@skyroc/web-ui';
import { Card, ToggleGroup } from '@skyroc/web-ui';

const items: ToggleGroupProps['items'] = [
  { label: 'Left', value: 'left' },
  { label: 'Center', value: 'center' },
  { label: 'Right', value: 'right' }
];

const ToggleGroupSingle = () => {
  return (
    <Card
      split
      title="Single"
    >
      <ToggleGroup
        items={items}
        type="single"
        defaultValue="center"
      />
    </Card>
  );
};

export default ToggleGroupSingle;
