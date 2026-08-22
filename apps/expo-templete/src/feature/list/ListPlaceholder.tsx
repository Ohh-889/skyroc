import { Button, Text } from '@skyroc/native-ui';
import { ActivityIndicator, View } from 'react-native';

import type { ListPlaceholderContext } from './types';

/** ListPlaceholder 组件属性 */
export interface ListPlaceholderProps extends ListPlaceholderContext {
  /** 容器 className */
  className?: string;
}

/**
 * 列表占位区，挂在 FlatList 的 ListEmptyComponent 上。
 *
 * 只在列表为空时渲染，所以「已有数据时后台刷新失败」不会把整页替换成错误页 —— 这也是这三种状态不做提前 return 的原因：
 * PullToRefresh 和滚动位置始终留在树里，空态和错误态一样能下拉刷新。
 */
export const ListPlaceholder = (props: ListPlaceholderProps) => {
  const { className, emptyText = '暂无数据', errorText = '加载失败，点击重试', onRetry, status } = props;

  if (status === 'loading') {
    return (
      <View className={className}>
        <ActivityIndicator size="small" />
      </View>
    );
  }

  if (status === 'error') {
    return (
      <View className={className}>
        <Text
          color="muted"
          size="sm"
        >
          {errorText}
        </Text>

        {onRetry ? (
          <Button
            size="sm"
            variant="outline"
            onPress={onRetry}
          >
            重试
          </Button>
        ) : null}
      </View>
    );
  }

  return (
    <View className={className}>
      <Text
        color="muted"
        size="sm"
      >
        {emptyText}
      </Text>
    </View>
  );
};
