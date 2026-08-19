import Feather from '@expo/vector-icons/Feather';
import { Radio } from '@skyroc/native-ui';
import { View } from 'react-native';

const RadioIndicator = () => {
  return (
    <View className="gap-4 bg-background p-4">
      <Radio
        defaultChecked
        iconSize={28}
      >
        iconSize=28
      </Radio>
      <Radio
        defaultChecked
        checkedIcon={
          <Feather
            color="var(--primary)"
            name="star"
            size={18}
          />
        }
        iconSize={28}
      >
        自定义 checkedIcon
      </Radio>
    </View>
  );
};

export { RadioIndicator };
