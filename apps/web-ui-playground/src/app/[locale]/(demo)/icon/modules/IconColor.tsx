'use client';

import { Icon } from '@skyroc/web-ui';

const IconColor = () => {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Icon
        className="text-primary"
        icon="lucide:heart"
      />

      <Icon
        className="text-destructive"
        icon="lucide:heart"
      />

      <Icon
        className="text-success"
        icon="lucide:heart"
      />

      <Icon
        className="text-warning"
        icon="lucide:heart"
      />

      <Icon
        className="text-info"
        icon="lucide:heart"
      />
    </div>
  );
};

export default IconColor;
