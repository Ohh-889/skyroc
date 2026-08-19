import { Tag, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const TagCloseable = () => {
  const [visible, setVisible] = useState(true);
  const [closeCount, setCloseCount] = useState(0);

  return (
    <View className="flex-row flex-wrap items-center gap-3 bg-background p-4">
      {visible ? (
        <Tag
          closeable
          closeAccessibilityLabel="移除筛选条件"
          onClose={() => setVisible(false)}
        >
          可移除
        </Tag>
      ) : (
        <Text className="text-sm text-muted-foreground">标签已移除</Text>
      )}
      <Tag
        closeable
        color="success"
        onClose={() => setCloseCount(current => current + 1)}
      >
        仅响应事件
      </Tag>
      <Text className="text-sm text-muted-foreground">onClose 次数：{closeCount}</Text>
    </View>
  );
};

export { TagCloseable };
