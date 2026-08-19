import Feather from '@expo/vector-icons/Feather';
import { Checkbox } from '@skyroc/native-ui';
import { View } from 'react-native';

const CheckboxCustomIcon = () => {
  return (
    <View className="gap-3 bg-background p-4">
      <Checkbox
        defaultChecked
        shape="square"
        checkedIcon={
          <Feather
            color="#fff"
            name="star"
            size={12}
          />
        }
      >
        Custom checked icon
      </Checkbox>
      <Checkbox
        checked="indeterminate"
        shape="square"
        indeterminateIcon={
          <Feather
            color="#fff"
            name="more-horizontal"
            size={12}
          />
        }
      >
        Custom indeterminate icon
      </Checkbox>
    </View>
  );
};

export { CheckboxCustomIcon };
