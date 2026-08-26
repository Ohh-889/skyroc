'use client';

import { cn } from '@skyroc/utils';
import { tagVariants } from './tag-variants';
import type { TagProps } from './types';

const TagUI = (props: TagProps) => {
  const { className, color, shape, size, variant, ...rest } = props;

  const mergedCls = cn(tagVariants({ color, shape, size, variant }), className);

  return (
    <div
      className={mergedCls}
      data-slot="tag"
      {...rest}
    />
  );
};

TagUI.displayName = 'TagUI';

export default TagUI;