import { Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const TextNativeProps = () => {
  const [pressCount, setPressCount] = useState(0);

  return (
    <View className="gap-3 bg-background p-4">
      <Text
        className="max-w-64"
        numberOfLines={1}
      >
        这是一段会在单行末尾自动省略的较长文字，用于验证 numberOfLines 属性。
      </Text>
      <Text
        selectable
        className="text-muted-foreground"
      >
        selectable：长按可选择并复制这段文字
      </Text>
      <Text
        className="font-medium text-primary"
        onPress={() => setPressCount(prev => prev + 1)}
      >
        onPress：已点击 {pressCount} 次
      </Text>
    </View>
  );
};

export { TextNativeProps };
