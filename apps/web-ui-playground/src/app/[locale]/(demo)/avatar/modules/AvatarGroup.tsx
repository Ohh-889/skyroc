'use client';

import { Avatar } from '@skyroc/web-ui';

const users = [
  { name: 'Alice', src: 'https://i.pravatar.cc/150?u=alice' },
  { name: 'Bob', src: 'https://i.pravatar.cc/150?u=bob' },
  { name: 'Charlie', src: 'https://i.pravatar.cc/150?u=charlie' },
  { name: 'Diana', src: 'https://i.pravatar.cc/150?u=diana' }
];

const AvatarGroup = () => {
  return (
    <div className="flex -space-x-3">
      {users.map(user => (
        <Avatar
          alt={user.name}
          className="ring-background ring-2"
          fallback={user.name.slice(0, 2).toUpperCase()}
          key={user.name}
          src={user.src}
        />
      ))}

      <Avatar
        alt="More users"
        fallback="+5"
        src=""
        classNames={{
          fallback: 'text-xs font-medium',
          root: 'ring-background ring-2'
        }}
      />
    </div>
  );
};

export default AvatarGroup;
