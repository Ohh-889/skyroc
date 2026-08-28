'use client';

import { Tag } from '@skyroc/web-ui';

const colors = ['primary', 'destructive', 'success', 'warning', 'info', 'carbon', 'secondary', 'accent'] as const;
const variants = ['solid', 'pure', 'outline', 'soft', 'ghost', 'raw'] as const;

const TagVariantColors = () => {
  return (
    <div className="flex flex-col gap-[12px]">
      {colors.map(color => (
        <div
          className="flex flex-wrap gap-[12px]"
          key={color}
        >
          {variants.map(variant => (
            <Tag
              color={color}
              key={variant}
              variant={variant}
            >
              {variant}
            </Tag>
          ))}
        </div>
      ))}
    </div>
  );
};

export default TagVariantColors;
