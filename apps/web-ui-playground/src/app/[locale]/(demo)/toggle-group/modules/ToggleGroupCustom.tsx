'use client';

import type { ToggleGroupProps } from '@skyroc/web-ui';
import { Card, ToggleGroup } from '@skyroc/web-ui';

const items: ToggleGroupProps['items'] = [
  { label: 'Bold', value: 'bold' },
  { label: 'Italic', value: 'italic' },
  { label: 'Code', value: 'code' }
];

const shortcuts: Record<string, string> = {
  bold: 'B',
  code: '`',
  italic: 'I'
};

const ToggleGroupCustom = () => {
  return (
    <Card
      split
      title="Custom"
    >
      <ToggleGroup
        items={items}
        type="multiple"
        variant="outline"
        classNames={{
          groupRoot: 'justify-start',
          toggle: 'gap-2'
        }}
        itemRender={item => (
          <>
            <span>{item.label}</span>
            <kbd className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">{shortcuts[item.value]}</kbd>
          </>
        )}
      />
    </Card>
  );
};

export default ToggleGroupCustom;
