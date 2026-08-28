'use client';

import { Icon } from '@skyroc/web-ui';

const IconBasic = () => {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Icon icon="lucide:home" />
      <Icon icon="lucide:settings" />
      <Icon icon="lucide:user" />
      <Icon icon="lucide:mail" />
      <Icon icon="lucide:bell" />
    </div>
  );
};

export default IconBasic;
