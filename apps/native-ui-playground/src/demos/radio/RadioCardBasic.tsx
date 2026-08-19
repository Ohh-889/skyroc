import Feather from '@expo/vector-icons/Feather';
import { RadioCard } from '@skyroc/native-ui';
import { View } from 'react-native';

const RadioCardBasic = () => {
  return (
    <View className="gap-3 bg-background p-4">
      <RadioCard
        color="primary"
        defaultChecked
        description="稳定且速度快"
        icon={
          <Feather
            color="var(--primary)"
            name="wifi"
            size={20}
          />
        }
        label="无线网络"
      />
      <RadioCard
        color="warning"
        description="使用移动数据"
        icon={
          <Feather
            color="var(--success)"
            name="smartphone"
            size={20}
          />
        }
        label="蜂窝网络"
        radioPosition="right"
        shape="square"
      />
      <RadioCard
        color="success"
        description="设备连接不可用"
        disabled
        icon={
          <Feather
            color="var(--muted-foreground)"
            name="bluetooth"
            size={20}
          />
        }
        label="蓝牙"
      />
    </View>
  );
};

export { RadioCardBasic };
