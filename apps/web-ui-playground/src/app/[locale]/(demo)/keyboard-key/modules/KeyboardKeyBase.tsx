'use client';

import { Kbd } from '@skyroc/web-ui';

const KeyboardKeyBase = () => {
  return (
    <div className="flex gap-2">
      <Kbd value="command" />
      <Kbd value="K" />
      <Kbd value={['ctrl', 'alt']} />
      <Kbd value={['ctrl', 'alt', 'delete']} />
      <Kbd value={['ctrl', 'shift', 'A']} />
    </div>
  );
};

export default KeyboardKeyBase;
