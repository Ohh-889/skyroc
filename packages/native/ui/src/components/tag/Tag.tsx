import { Pressable, View } from 'react-native';
import { cn, isString } from '@skyroc/utils';
import { Text } from '../text/Typography';
import { tagVariants } from './tag-variants';
import type { TagProps } from './types';

const Tag = (props: TagProps) => {
  const {
    children,
    className,
    closeable = false,
    color = 'primary',
    onClose,
    shape = 'rounded',
    size = 'md',
    variant = 'solid',
    ...rest
  } = props;

  const slots = tagVariants({ variant, color, size, shape });

  return (
    <View
      className={cn(slots.root(), className)}
      {...rest}
    >
      {isString(children) ? <Text className={slots.text()}>{children}</Text> : children}
      {closeable ? (
        <Pressable onPress={onClose}>
          <Text className={slots.closeIcon()}>✕</Text>
        </Pressable>
      ) : null}
    </View>
  );
};

export { Tag };
