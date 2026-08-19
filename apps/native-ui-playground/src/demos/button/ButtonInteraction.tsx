import { Button, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const ButtonInteraction = () => {
  const [message, setMessage] = useState('等待操作');

  function handlePress() {
    setMessage('触发 onPress');
  }

  function handleLongPress() {
    setMessage('触发 onLongPress');
  }

  return (
    <View className="gap-3 bg-background p-4">
      <Button
        onLongPress={handleLongPress}
        onPress={handlePress}
      >
        点击或长按
      </Button>
      <Text className="text-center text-sm text-muted-foreground">当前结果：{message}</Text>
    </View>
  );
};

export { ButtonInteraction };
