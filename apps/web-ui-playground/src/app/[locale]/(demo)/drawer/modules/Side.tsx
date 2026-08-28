'use client';

import type { DrawerSide } from '@skyroc/web-ui';
import { Button, Drawer } from '@skyroc/web-ui';

const sides: DrawerSide[] = ['left', 'right', 'top', 'bottom'];

const Side = () => {
  return (
    <div className="flex flex-wrap gap-3">
      {sides.map(side => (
        <Drawer
          key={side}
          title="Drawer Title"
          trigger={<Button variant="plain">{side}</Button>}
          contentProps={{
            side
          }}
        >
          Drawer Content
        </Drawer>
      ))}
    </div>
  );
};

export default Side;
