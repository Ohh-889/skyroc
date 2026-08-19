import { Button, Input } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const InputPassword = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <View className="gap-3 bg-background p-4">
      <Input
        placeholder="非受控可见性"
        type="password"
      />
      <Input
        clearable
        defaultValue="clearable + password"
        type="password"
      />
      <Input
        passwordVisible={passwordVisible}
        placeholder="受控可见性"
        type="password"
        onPasswordVisibleChange={setPasswordVisible}
      />
      <Button
        size="sm"
        onPress={() => setPasswordVisible(v => !v)}
      >
        {passwordVisible ? '隐藏密码' : '显示密码'}
      </Button>
    </View>
  );
};

export { InputPassword };
