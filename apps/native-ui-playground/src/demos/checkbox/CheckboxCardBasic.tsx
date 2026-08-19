import Feather from '@expo/vector-icons/Feather';
import { CheckboxCard } from '@skyroc/native-ui';
import { View } from 'react-native';

const CheckboxCardBasic = () => {
  return (
    <View className="gap-3 bg-background p-4">
      <CheckboxCard
        color="primary"
        defaultChecked
        description="Fast and reliable"
        icon={
          <Feather
            color="#3b82f6"
            name="wifi"
            size={20}
          />
        }
        label="Wi-Fi"
      />
      <CheckboxCard
        checkboxPosition="right"
        color="warning"
        description="Mobile data connection"
        icon={
          <Feather
            color="#22c55e"
            name="smartphone"
            size={20}
          />
        }
        label="Cellular"
        shape="square"
      />
      <CheckboxCard
        color="success"
        description="Direct device connection"
        disabled
        icon={
          <Feather
            color="#8b5cf6"
            name="bluetooth"
            size={20}
          />
        }
        label="Bluetooth"
      />
    </View>
  );
};

export { CheckboxCardBasic };
