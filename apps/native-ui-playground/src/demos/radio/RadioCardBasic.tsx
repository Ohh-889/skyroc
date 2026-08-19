import Feather from '@expo/vector-icons/Feather';
import { RadioCard } from '@skyroc/native-ui';
import { View } from 'react-native';

const RadioCardBasic = () => {
  return (
    <View className="gap-3 bg-background p-4">
      <RadioCard
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
      <RadioCard
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
        radioPosition="right"
        shape="square"
      />
      <RadioCard
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

export { RadioCardBasic };
