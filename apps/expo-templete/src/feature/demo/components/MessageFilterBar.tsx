import { Text } from '@skyroc/native-ui';
import { Pressable, ScrollView } from 'react-native';

import type { MessageQuery } from '../mock-api';
import { MESSAGE_FILTERS } from './message-meta';

/** MessageFilterBar 组件属性 */
export interface MessageFilterBarProps {
  onChange: (type: MessageQuery['type']) => void;

  value: MessageQuery['type'];
}

/**
 * 消息类型筛选条。
 *
 * 固定在列表外面，不跟着列表滚：翻到第三页想换类型时，跟着滚的筛选条得先滑回顶部才够得着。
 */
export const MessageFilterBar = (props: MessageFilterBarProps) => {
  const { onChange, value } = props;

  return (
    <ScrollView
      horizontal
      className="max-h-11 flex-grow-0"
      contentContainerClassName="gap-2 px-4"
      showsHorizontalScrollIndicator={false}
    >
      {MESSAGE_FILTERS.map(filter => {
        const active = filter.key === value;

        return (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            key={filter.key}
            onPress={() => onChange(filter.key)}
            className={`h-8 flex-row items-center rounded-full px-3.5 active:opacity-60 ${
              active ? 'bg-primary' : 'bg-muted'
            }`}
          >
            <Text
              className={active ? 'text-primary-foreground' : 'text-muted-foreground'}
              size="xs"
              weight={active ? 'semibold' : 'normal'}
            >
              {filter.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
};
