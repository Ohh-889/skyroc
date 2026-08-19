import { Switch } from '@skyroc/native-ui';
import { View } from 'react-native';

const SwitchDisabled = () => {
  return (
    <View className="bg-background px-6">
      <View className="mb-8 flex-row items-center gap-3">
        <Switch disabled />
        <Switch
          defaultChecked
          disabled
        />
      </View>
    </View>
  );
};

export { SwitchDisabled };
