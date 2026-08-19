import Feather from '@expo/vector-icons/Feather';
import { RadioGroupCard, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const CARD_ITEMS = [
  {
    description: 'Fast and reliable',
    icon: (
      <Feather
        color="#3b82f6"
        name="wifi"
        size={20}
      />
    ),
    label: 'Wi-Fi',
    value: 'wifi'
  },
  {
    description: 'Mobile data connection',
    icon: (
      <Feather
        color="#22c55e"
        name="smartphone"
        size={20}
      />
    ),
    label: 'Cellular',
    value: 'cellular'
  },
  {
    description: 'Direct device connection',
    icon: (
      <Feather
        color="#8b5cf6"
        name="bluetooth"
        size={20}
      />
    ),
    label: 'Bluetooth',
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
      <Text className="text-sm text-muted-foreground">Selected: {cardGroupValue}</Text>
    </View>
  );
};

export { RadioCardGroup };
