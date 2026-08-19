import { CountDown, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const CountDownFinish = () => {
  const [finishCount, setFinishCount] = useState(0);

  return (
    <View className="bg-background px-6 py-4">
      <View className="mb-2">
        <CountDown
          format="ss"
          time={5 * 1000}
          onFinish={() => setFinishCount(prev => prev + 1)}
        />
      </View>
      <Text color="muted">onFinish 已触发 {finishCount} 次（每轮只应 +1，切后台再回来也不应重复）</Text>
    </View>
  );
};

export { CountDownFinish };
