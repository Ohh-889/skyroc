'use client';

import { Avatar } from '@skyroc/web-ui';

const AvatarBasic = () => {
  return (
    <div className="flex gap-[12px]">
      <Avatar
        alt="User Avatar"
        fallback="CN"
        src="https://assets.skyroc.me/asset/logo.svg"
      />

      <Avatar
        alt="User Avatar"
        fallback="JD"
        src="https://github.com/shadcn.png"
      />
    </div>
  );
};

export default AvatarBasic;
