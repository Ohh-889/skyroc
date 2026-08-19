import { Switch } from '@skyroc/native-ui';
import { View } from 'react-native';

const SwitchStyles = () => {
  return (
    <View className="flex-row items-center gap-3 bg-background p-4">
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
      <Switch
        loading
        classNames={{ indicator: 'accent-destructive' }}
        size="2xl"
      />
    </View>
  );
};

export { SwitchStyles };
