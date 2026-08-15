import { useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { cn } from '@skyroc/utils';
import { Image } from './Image';
import type { ImageFallbackProps } from './types';

const ImageFallback = (props: ImageFallbackProps) => {
  const { className, errorSlot, loadingSlot, showError = false, showLoading = false, src, ...rest } = props;

  const [loading, setLoading] = useState(showLoading);
  const [error, setError] = useState(false);

  const shouldShowLoading = loading && showLoading;

  const shouldShowError = error && showError;

  function handleLoad() {
    setLoading(false);
  }

  function handleError() {
    setError(true);
    setLoading(false);
  }

  return (
    <View className={cn('relative overflow-hidden', className)}>
      {!shouldShowError && src && (
        <Image
          className="h-full w-full"
          src={src}
          transition={200}
          onError={handleError}
          onLoad={handleLoad}
          {...rest}
        />
      )}

      {shouldShowLoading && (
        <View className="absolute inset-0 items-center justify-center bg-muted">
          {loadingSlot || (
            <ActivityIndicator
              className="text-muted-foreground"
              size="small"
            />
          )}
        </View>
      )}

      {shouldShowError && <View className="absolute inset-0 items-center justify-center bg-muted">{errorSlot}</View>}
    </View>
  );
};

export { ImageFallback };
