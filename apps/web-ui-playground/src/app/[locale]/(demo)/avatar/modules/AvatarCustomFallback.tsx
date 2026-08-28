'use client';

import { Avatar } from '@skyroc/web-ui';
import { User } from 'lucide-react';
import Image from 'next/image';

const AvatarCustomFallback = () => {
  return (
    <div className="flex gap-[12px]">
      {/* 使用 lucide 图标 */}
      <Avatar
        alt="User Avatar"
        fallback={<User className="size-5" />}
        src="https://invalid-url.com/image.png"
      />

      {/* 使用自定义图片 */}
      <Avatar
        alt="User Avatar"
        classNames={{ fallback: 'bg-foreground' }}
        src="https://invalid-url.com/image.png"
        fallback={
          <Image
            alt="Fallback"
            className="dark:invert"
            height={20}
            src="https://assets.skyroc.me/asset/logo.svg"
            width={20}
          />
        }
      />
    </div>
  );
};

export default AvatarCustomFallback;
