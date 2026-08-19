import { Switch } from '@skyroc/native-ui';
import { View } from 'react-native';

const SwitchUncontrolled = () => {
  return (
    <View className="bg-background px-6">
      <View className="mb-8 flex-row items-center gap-3">
        <Switch defaultChecked />
        <Switch />
      </View>
    </View>
  );
};

export { SwitchUncontrolled };
