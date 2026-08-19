import { Switch, Text } from '@skyroc/native-ui';
import { View } from 'react-native';

const SwitchDisabled = () => {
  return (
    <View className="gap-3 bg-background p-4">
      <View className="flex-row items-center gap-3">
        <Switch disabled />
        <Text color="muted">禁用·关闭</Text>
      </View>
      <View className="flex-row items-center gap-3">
        <Switch
          defaultChecked
          disabled
        />
        <Text color="muted">禁用·开启</Text>
      </View>
    </View>
  );
};

export { SwitchDisabled };
