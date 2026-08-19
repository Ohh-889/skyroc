import { PasswordInput, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

/** 关掉掩码直接显示字符 */
const PasswordInputMask = () => {
  const [plain, setPlain] = useState('');

  return (
    <View className="gap-3 bg-background p-4">
      <PasswordInput
        mask={false}
        value={plain}
        onChangeText={setPlain}
      />
      <Text className="text-sm text-muted-foreground">mask=false 时显示明文，字号跟随 size</Text>
    </View>
  );
};

export { PasswordInputMask };
