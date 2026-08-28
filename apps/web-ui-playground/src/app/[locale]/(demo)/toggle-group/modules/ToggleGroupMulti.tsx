'use client';

import type { ToggleGroupProps } from '@skyroc/web-ui';
import { Card, Label, ToggleGroup } from '@skyroc/web-ui';

const items: ToggleGroupProps['items'] = [
  { label: 'Bold', value: 'bold' },
  { label: 'Italic', value: 'italic' },
  { label: 'Underline', value: 'underline' },
  { label: 'Strike', value: 'strike' }
];

const ToggleGroupMulti = () => {
  return (
    <Card
      split
      title="Multi"
    >
      <ToggleGroup
        items={items}
        type="multiple"
        defaultValue={['bold', 'underline']}
        itemRender={item => {
          return <Label>{item.label}</Label>;
        }}
      />
    </Card>
  );
};

export default ToggleGroupMulti;
