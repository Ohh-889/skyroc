import Feather from '@expo/vector-icons/Feather';
import { CheckboxCard, CheckboxGroup } from '@skyroc/native-ui';
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

const CheckboxCardInGroup = () => {
  return (
    <View className="gap-3 bg-background p-4">
      <CheckboxGroup
        color="info"
        defaultValue={['wifi']}
        max={2}
      >
        {CARD_ITEMS.map(item => (
          <CheckboxCard
            key={item.value}
            description={item.description}
            icon={item.icon}
            label={item.label}
            name={item.value}
          />
        ))}
      </CheckboxGroup>
    </View>
  );
};

export { CheckboxCardInGroup };
