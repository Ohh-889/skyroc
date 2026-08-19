import { Switch, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const SwitchBasic = () => {
  const [basic, setBasic] = useState(false);

  return (
    <View className="bg-background px-6">
      <View className="mb-8 flex-row items-center gap-3">
        <Switch
          checked={basic}
          onCheckedChange={setBasic}
        />
        <Text color="muted">当前状态：{basic ? '开' : '关'}</Text>
      </View>
    </View>
  );
};

export { SwitchBasic };
