'use client';

import { Tag } from '@skyroc/web-ui';

const shapes = ['auto', 'rounded'] as const;

const TagShape = () => {
  return (
    <div className="flex flex-wrap gap-[12px]">
      {shapes.map(shape => (
        <Tag
          key={shape}
          shape={shape}
          variant="ghost"
        >
          {shape}
        </Tag>
      ))}
    </div>
  );
};

export default TagShape;
