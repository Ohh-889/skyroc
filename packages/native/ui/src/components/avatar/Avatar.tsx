import { cn, isString } from '@skyroc/utils';
import { useState } from 'react';
import { View } from 'react-native';
import { Image } from '../image/Image';
import { Text } from '../text/Typography';
import { avatarFallbackTextSize, avatarVariants } from './avatar-variants';
import type { AvatarProps } from './types';

const Avatar = (props: AvatarProps) => {
  const { className, classNames, fallback, imageProps, size = 'md', src } = props;

  const [error, setError] = useState(false);

  const variantSlots = avatarVariants({ size });

  /** 变体槽与调用方覆盖类合并成最终类名，集中一处，避免 JSX 里散落 cn 调用 */
  function resolveSlotClassNames() {
    return {
      fallback: cn(variantSlots.fallback(), classNames?.fallback),
      fallbackText: cn(
        'font-medium text-muted-foreground',
        avatarFallbackTextSize[size || 'md'],
        classNames?.fallbackText
      ),
      image: cn(variantSlots.image(), classNames?.image),
      root: cn(variantSlots.root(), classNames?.root, className)
    };
  }

  const slotClassNames = resolveSlotClassNames();

  const showFallback = !src || error;

  function handleError() {
    setError(true);
  }

  return (
    <View className={slotClassNames.root}>
      {showFallback ? (
        <View className={slotClassNames.fallback}>
          {isString(fallback) ? <Text className={slotClassNames.fallbackText}>{fallback}</Text> : fallback}
        </View>
      ) : (
        <Image
          className={slotClassNames.image}
          contentFit="cover"
          src={src}
          onError={handleError}
          {...imageProps}
        />
      )}
    </View>
  );
};

export { Avatar };
