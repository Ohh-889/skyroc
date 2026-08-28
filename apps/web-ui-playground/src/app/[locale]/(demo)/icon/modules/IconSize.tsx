'use client';

import { Icon } from '@skyroc/web-ui';

const IconSize = () => {
  return (
    <div className="flex flex-wrap items-end gap-4">
      <Icon
        height="16"
        icon="lucide:star"
        width="16"
      />

      <Icon
        height="20"
        icon="lucide:star"
        width="20"
      />

      <Icon
        height="24"
        icon="lucide:star"
        width="24"
      />

      <Icon
        height="32"
        icon="lucide:star"
        width="32"
      />

      <Icon
        height="48"
        icon="lucide:star"
        width="48"
      />
    </div>
  );
};

export default IconSize;
