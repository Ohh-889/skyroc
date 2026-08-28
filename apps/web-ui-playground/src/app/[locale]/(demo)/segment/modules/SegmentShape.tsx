'use client';

import type { SegmentProps } from '@skyroc/web-ui';
import { Card, Segment } from '@skyroc/web-ui';
import { useState } from 'react';

const items: SegmentProps['items'] = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' }
];

const SegmentShape = () => {
  const [value, setValue] = useState('monday');

  return (
    <div className="flex-c gap-3">
      <Card title="Square">
        <Segment
          items={items}
          shape="square"
          value={value}
          onValueChange={setValue}
        />
      </Card>

      <Card title="Rounded">
        <Segment
          items={items}
          shape="rounded"
          value={value}
          onValueChange={setValue}
        />
      </Card>
    </div>
  );
};

export default SegmentShape;
