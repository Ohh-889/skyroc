'use client';

import type { ToggleGroupProps } from '@skyroc/web-ui';
import { Card, ToggleGroup } from '@skyroc/web-ui';

const items: ToggleGroupProps['items'] = [
  { label: 'Top', value: 'top' },
  { disabled: true, label: 'Right', value: 'right' },
  { label: 'Bottom', value: 'bottom' },
  { label: 'Left', value: 'left' }
];

const ToggleGroupDisabled = () => {
  return (
    <Card
      split
      title="Disabled"
    >
      <ToggleGroup
        items={items}
        type="multiple"
        defaultValue={['top']}
        variant="outline"
      />
    </Card>
  );
};

export default ToggleGroupDisabled;
