import { Button, Text } from '@skyroc/native-ui';
import { ActivityIndicator, View } from 'react-native';

import type { ListFooterContext } from './types';

/** ListFooter 组件属性 */
export interface ListFooterProps extends ListFooterContext {
  /** 容器 className */
  className?: string;

  /** 折叠态下点「查看更多」的回调 */
  onExpand?: () => void;
}

/**
 * 列表底部状态区：折叠 / 加载下一页 / 已到底 三选一。
 *
 * 一条数据都没有时返回 null，把版面让给 ListPlaceholder，避免空列表下面还挂一句「没有更多了」。
 */
export const ListFooter = (props: ListFooterProps) => {
  const { className, collapsed, count, isEnd, isFetchingMore, onExpand } = props;

  if (count === 0) return null;

  // 折叠态优先级最高：这时列表本来就不该继续加载，展示入口而不是加载状态
  if (collapsed) {
    return (
      <View className={className}>
        <Button
          color="muted"
          size="sm"
          variant="ghost"
          onPress={onExpand}
        >
          查看更多
        </Button>
      </View>
    );
  }

  if (isFetchingMore) {
    return (
      <View className={className}>
        <ActivityIndicator size="small" />

        <Text
          color="muted"
          size="sm"
        >
          加载中
        </Text>
      </View>
    );
  }

  if (isEnd) {
    return (
      <View className={className}>
        <Text
          color="muted"
          size="xs"
        >
          没有更多了
        </Text>
      </View>
    );
  }

  return null;
};
