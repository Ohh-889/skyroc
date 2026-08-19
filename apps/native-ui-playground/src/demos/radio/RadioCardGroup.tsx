import Feather from '@expo/vector-icons/Feather';
import { RadioGroupCard, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const CARD_ITEMS = [
  {
    description: '稳定且速度快',
    icon: (
      <Feather
        color="var(--primary)"
        name="wifi"
        size={20}
      />
    ),
    label: '无线网络',
    value: 'wifi'
  },
  {
    description: '使用移动数据',
    icon: (
      <Feather
        color="var(--success)"
        name="smartphone"
        size={20}
      />
    ),
    label: '蜂窝网络',
    value: 'cellular'
  },
  {
    description: '直连附近设备',
    icon: (
      <Feather
        color="var(--info)"
        name="bluetooth"
        size={20}
      />
    ),
    label: '蓝牙',
    value: 'bluetooth'
  }
];

const RadioCardGroup = () => {
  const [cardGroupValue, setCardGroupValue] = useState('wifi');

  return (
    <View className="gap-3 bg-background p-4">
      <RadioGroupCard
        color="info"
        items={CARD_ITEMS}
        radioPosition="right"
        value={cardGroupValue}
        onChange={setCardGroupValue}
      />
      <Text className="text-sm text-muted-foreground">当前值：{cardGroupValue}</Text>
    </View>
  );
};

export { RadioCardGroup };
