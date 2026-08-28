'use client';

import { Tag } from '@skyroc/web-ui';

const colors = ['primary', 'destructive', 'success', 'warning', 'info', 'carbon', 'secondary', 'accent'] as const;

const TagColor = () => {
  return (
    <div className="flex flex-wrap gap-[12px]">
      {colors.map(color => (
        <Tag
          color={color}
          key={color}
        >
          {color}
        </Tag>
      ))}
    </div>
  );
};

export default TagColor;
