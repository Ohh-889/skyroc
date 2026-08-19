import { Switch, Text } from '@skyroc/native-ui';
import { View } from 'react-native';

const SwitchUncontrolled = () => {
  return (
    <View className="gap-3 bg-background p-4">
      <View className="flex-row items-center gap-3">
        <Switch defaultChecked />
        <Text color="muted">defaultChecked=true</Text>
      </View>
      <View className="flex-row items-center gap-3">
        <Switch />
        <Text color="muted">defaultChecked=false</Text>
      </View>
    </View>
  );
};

export { SwitchUncontrolled };
