import { Checkbox } from '@skyroc/native-ui';
import { View } from 'react-native';

const CheckboxIconSize = () => {
  return (
    <View className="gap-3 bg-background p-4">
      <Checkbox
        defaultChecked
        iconSize={16}
      >
        16px
      </Checkbox>
      <Checkbox
        defaultChecked
        iconSize={28}
      >
        28px
      </Checkbox>
      <Checkbox
        defaultChecked
        iconSize={40}
      >
        40px
      </Checkbox>
    </View>
  );
};

export { CheckboxIconSize };
