'use client';

import type { SegmentProps } from '@skyroc/web-ui';
import { Card, Segment } from '@skyroc/web-ui';
import { useState } from 'react';

const items: SegmentProps['items'] = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' }
];

const SegmentOrientation = () => {
  const [value, setValue] = useState('monday');

  return (
    <div className="flex-c gap-3">
      <Card title="Horizontal">
        <Segment
          items={items}
          value={value}
          onValueChange={setValue}
        />
      </Card>

      <Card title="Vertical">
        <div className="lt-sm:w-auto w-80">
          <Segment
            items={items}
            orientation="vertical"
            value={value}
            onValueChange={setValue}
          />
        </div>
      </Card>
    </div>
  );
};

export default SegmentOrientation;
