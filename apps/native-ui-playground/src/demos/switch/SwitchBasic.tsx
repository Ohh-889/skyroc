import { Switch, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const SwitchBasic = () => {
  const [basic, setBasic] = useState(false);

  return (
    <View className="flex-row items-center gap-3 bg-background p-4">
      <Switch
        checked={basic}
        onCheckedChange={setBasic}
      />
      <Text color="muted">当前状态：{basic ? '开' : '关'}</Text>
    </View>
  );
};

export { SwitchBasic };
