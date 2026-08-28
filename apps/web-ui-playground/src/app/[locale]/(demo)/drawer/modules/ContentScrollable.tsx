'use client';

import { Button, Drawer } from '@skyroc/web-ui';

const ContentScrollable = () => {
  return (
    <Drawer
      title="Drawer Title"
      trigger={<Button variant="plain">Scrollable</Button>}
    >
      {Array.from({ length: 100 }).map((_, i) => (
        <div key={i}>Drawer Content</div>
      ))}
    </Drawer>
  );
};

export default ContentScrollable;
