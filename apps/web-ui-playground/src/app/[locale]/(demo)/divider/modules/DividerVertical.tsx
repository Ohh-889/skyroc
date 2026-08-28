'use client';

import { Divider } from '@skyroc/web-ui';

const DividerVertical = () => {
  return (
    <div className="flex h-5 items-center space-x-4">
      <div>Skyroc</div>
      <Divider orientation="vertical" />
      <div>UI</div>
      <Divider orientation="vertical" />
      <div>Vue</div>
    </div>
  );
};

export default DividerVertical;
