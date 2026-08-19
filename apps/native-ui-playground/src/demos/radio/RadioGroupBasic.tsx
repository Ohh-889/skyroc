import { Radio, RadioGroup, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const FRUIT_ITEMS = [
  { label: 'Apple', value: 'apple' },
  { label: 'Orange', value: 'orange' },
  { label: 'Banana', value: 'banana' },
  { label: 'Grape', value: 'grape' }
];

const RadioGroupBasic = () => {
  const [groupValue, setGroupValue] = useState('apple');

  return (
    <View className="gap-3 bg-background p-4">
      <RadioGroup
        value={groupValue}
        onChange={setGroupValue}
      >
        {FRUIT_ITEMS.map(item => (
          <Radio
            key={item.value}
            name={item.value}
          >
            {item.label}
          </Radio>
        ))}
      </RadioGroup>
      <Text className="text-sm text-muted-foreground">Selected: {groupValue}</Text>
    </View>
  );
};

export { RadioGroupBasic };
