import { View } from 'react-native';
import { cn } from '@skyroc/utils';
import type { SpaceProps } from './types';
import { spaceVariants } from './space-variants';

const Space = (props: SpaceProps) => {
  const { align, children, className, direction = 'horizontal', fill, size = 'md', wrap, ...rest } = props;

  const variantClass = spaceVariants({
    align,
    direction,
    fill,
    size,
    wrap
  });

  return (
    <View
      className={cn(variantClass, className)}
      {...rest}
    >
      {children}
    </View>
  );
};

export { Space };
