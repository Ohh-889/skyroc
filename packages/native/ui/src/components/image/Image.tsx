import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { cn, isNil, isNumber, isString } from '@skyroc/utils';
import type { ImageErrorEventData, ImageLoadEventData } from 'expo-image';
import { Image as EXImage } from 'expo-image';
import { useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { withUniwind } from 'uniwind';
import { imageVariants } from './image-variants';
import type { ImageProps, ImageSource } from './types';

/** Expo-image 不认 className，用 withUniwind 把工具类映射到 style 上 */
const StyledImage = withUniwind(EXImage);

/** MaterialIcons 不认 className，用 withUniwind 把 `accent-*` 工具类映射到 color 上，让失败图标色跟随主题 token */
const BrokenIcon = withUniwind(MaterialIcons);

/**
 * 把任意 source 形态压成稳定字符串。
 *
 * 调用方常写 `src={{ uri }}` 这类内联字面量，每次渲染都是新引用；若直接用引用判断 src 是否变化， 父组件的任何一次重渲染都会把加载态重置成 loading，占位层随之闪烁。
 */
function resolveSourceKey(value: ImageSource | undefined): string {
  if (isNil(value)) return '';

  if (isString(value)) return value;

  if (isNumber(value)) return `asset:${value}`;

  return JSON.stringify(value);
}

const Image = (props: ImageProps) => {
  const {
    className,
    classNames,
    errorSlot,
    loadingSlot,
    onError,
    onLoad,
    radius,
    showError = true,
    showLoading = true,
    src,
    transition = 200,
    ...rest
  } = props;

  const sourceKey = resolveSourceKey(src);

  const [trackedKey, setTrackedKey] = useState(sourceKey);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  /**
   * Src 变化时重置加载态。
   *
   * 这是"由 props 派生 state"，React 官方建议在渲染期直接调整而非放进 effect： 放进 effect 会先用旧状态渲染一帧，换图时能看到上一张图的错误占位。
   */
  if (trackedKey !== sourceKey) {
    setTrackedKey(sourceKey);
    setLoading(true);
    setFailed(false);
  }

  const variantSlots = imageVariants({ radius });

  /** 变体槽与调用方覆盖类合并成最终类名，集中一处，避免 JSX 里散落 cn 调用 */
  function resolveSlotClassNames() {
    return {
      error: cn(variantSlots.error(), classNames?.error),
      image: cn(variantSlots.image(), classNames?.image),
      indicator: cn(variantSlots.indicator(), classNames?.indicator),
      loading: cn(variantSlots.loading(), classNames?.loading),
      root: cn(variantSlots.root(), classNames?.root, className)
    };
  }

  /** 空 src 与加载失败在展示上等价，统一收敛成三个布尔值，避免 JSX 里再堆条件 */
  function resolveStatus() {
    const errored = failed || sourceKey === '';

    return {
      errored,
      shouldShowError: showError && errored,
      shouldShowLoading: showLoading && loading && !errored
    };
  }

  const slotClassNames = resolveSlotClassNames();

  const { errored, shouldShowError, shouldShowLoading } = resolveStatus();

  function handleLoad(event: ImageLoadEventData) {
    setLoading(false);
    onLoad?.(event);
  }

  function handleError(event: ImageErrorEventData) {
    setFailed(true);
    setLoading(false);
    onError?.(event);
  }

  const source = isString(src) ? { uri: src } : src;

  return (
    <View className={slotClassNames.root}>
      {!errored && (
        <StyledImage
          className={slotClassNames.image}
          source={source}
          transition={transition}
          {...rest}
          onError={handleError}
          onLoad={handleLoad}
        />
      )}

      {shouldShowLoading && (
        <View className={slotClassNames.loading}>
          {loadingSlot ?? (
            <ActivityIndicator
              colorClassName={slotClassNames.indicator}
              size="small"
            />
          )}
        </View>
      )}

      {shouldShowError && (
        <View className={slotClassNames.error}>
          {errorSlot ?? (
            <BrokenIcon
              colorClassName={slotClassNames.indicator}
              name="broken-image"
              size={24}
            />
          )}
        </View>
      )}
    </View>
  );
};

export { Image };
