import { Switch } from '@skyroc/native-ui';
import { View } from 'react-native';

const SwitchStyles = () => {
  return (
    <View className="bg-background px-6">
      <View className="mb-8 flex-row items-center gap-3">
        <Switch
          className="bg-warning/30"
          defaultChecked={false}
        />
        <Switch
          classNames={{
            checkedOverlay: 'bg-info',
            thumb: 'bg-info-50'
          }}
          defaultChecked
        />
      </View>
    </View>
  );
};

export { SwitchStyles };
