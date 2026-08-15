import { useState } from 'react';
import { View } from 'react-native';
import { cn, isString } from '@skyroc/utils';
import { Image } from '../image/Image';
import { Text } from '../text/Typography';
import { avatarFallbackTextSize, avatarVariants } from './avatar-variants';
import type { AvatarProps } from './types';

const Avatar = (props: AvatarProps) => {
  const { className, fallback, fallbackClassName, imageClassName, imageProps, size = 'md', src } = props;

  const [error, setError] = useState(false);

  const { fallback: fallbackCls, image: imageCls, root: rootCls } = avatarVariants({ size });

  const fallbackTextCls = cn('font-medium text-muted-foreground', avatarFallbackTextSize[size || 'md']);

  const avatarCls = cn(imageCls(), imageClassName);

  const showFallback = !src || error;

  function handleError() {
    setError(true);
  }

  return (
    <View className={cn(rootCls(), className)}>
      {showFallback ? (
        <View className={cn(fallbackCls(), fallbackClassName)}>
          {isString(fallback) ? <Text className={fallbackTextCls}>{fallback}</Text> : fallback}
        </View>
      ) : (
        <Image
          className={avatarCls}
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
