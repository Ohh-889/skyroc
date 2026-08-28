'use client';

import type { KbdSize } from '@skyroc/web-ui';
import { Kbd } from '@skyroc/web-ui';

const sizes: KbdSize[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];

const KeyboardKeySize = () => {
  return (
    <div className="flex flex-wrap gap-2">
      {sizes.map(size => (
        <Kbd
          key={size}
          size={size}
          value="command"
        />
      ))}
    </div>
  );
};

export default KeyboardKeySize;
