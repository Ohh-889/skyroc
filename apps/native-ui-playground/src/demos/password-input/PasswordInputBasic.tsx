import { PasswordInput, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

/** 默认 6 位、掩码、数字键盘 */
const PasswordInputBasic = () => {
  const [basic, setBasic] = useState('');
  const [completed, setCompleted] = useState('-');

  return (
    <View className="gap-3 bg-background p-4">
      <PasswordInput
        value={basic}
        onChangeText={setBasic}
        onComplete={setCompleted}
      />
      <Text className="text-sm text-muted-foreground">当前值：{basic || '（空）'}</Text>
      <Text className="text-sm text-muted-foreground">最近一次 onComplete：{completed}</Text>
    </View>
  );
};

export { PasswordInputBasic };
