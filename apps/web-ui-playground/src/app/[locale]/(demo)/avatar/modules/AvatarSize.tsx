'use client';

import { Avatar } from '@skyroc/web-ui';

const sizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;

const AvatarSize = () => {
  return (
    <div className="flex flex-wrap items-end gap-[12px]">
      {sizes.map(size => (
        <div
          className="flex flex-col items-center gap-2"
          key={size}
        >
          <Avatar
            alt="User Avatar"
            fallback="SKY"
            size={size}
            src="https://assets.skyroc.me/asset/logo.png"
          />

          <span className="text-muted-foreground text-xs">{size}</span>
        </div>
      ))}
    </div>
  );
};

export default AvatarSize;
