'use client';

import TagUI from '../../components/tag/TagUI';
import type { TagProps } from '../../components/tag/types';
import { useComponentConfig } from '../config-provider/context';

const Tag = (props: TagProps) => {
  const config = useComponentConfig('tag');

  const mergedProps = {
    ...config,
    ...props
  };

  return <TagUI {...mergedProps} />;
};

Tag.displayName = 'Tag';

export default Tag;
