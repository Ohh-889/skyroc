import { Input, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const InputControlled = () => {
  const [controlled, setControlled] = useState('');

  const emailError = controlled.length > 0 && !controlled.includes('@');

  return (
    <View className="gap-3 bg-background p-4">
      <Input
        clearable
        error={emailError}
        placeholder="输入邮箱"
        value={controlled}
        onChangeText={setControlled}
      />
      <Text className="text-sm text-muted-foreground">当前值：{controlled || '（空）'}</Text>
      {emailError ? <Text className="text-sm text-destructive">邮箱必须包含 @</Text> : null}
    </View>
  );
};

export { InputControlled };
