'use client';

import type { SegmentProps } from '@skyroc/web-ui';
import { Segment } from '@skyroc/web-ui';
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

const SegmentBasic = () => {
  const [value, setValue] = useState('monday');

  return (
    <Segment
      items={items}
      value={value}
      onValueChange={setValue}
    />
  );
};

export default SegmentBasic;
