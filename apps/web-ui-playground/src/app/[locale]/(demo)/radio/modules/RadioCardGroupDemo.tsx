'use client';

import { RadioCardGroup } from '@skyroc/web-ui';
import type { RadioCardGroupProps } from '@skyroc/web-ui';
import { Apple, Banana, Cherry, Grape } from 'lucide-react';
import { useState } from 'react';

const items: RadioCardGroupProps['items'] = [
  { icon: <Apple className="size-5" />, label: 'Apple', value: 'apple', description: 'This is an apple' },
  { icon: <Cherry className="size-5" />, label: 'Cherry', value: 'cherry', description: 'This is a cherry' },
  { icon: <Banana className="size-5" />, label: 'Banana', value: 'banana', description: 'This is a banana' },
  { icon: <Grape className="size-5" />, label: 'Grape', value: 'grape', description: 'This is a grape' }
];

const RadioCardGroupDemo = () => {
  const [value, setValue] = useState<string>('apple');

  return (
    <RadioCardGroup
      color="destructive"
      items={items}
      radioPosition="right"
      value={value}
      onValueChange={setValue}
    />
  );
};

export default RadioCardGroupDemo;
