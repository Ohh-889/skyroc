import { Checkbox, CheckboxGroup, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const FRUIT_ITEMS = [
  { label: 'Apple', value: 'apple' },
  { label: 'Orange', value: 'orange' },
  { label: 'Banana', value: 'banana' },
  { label: 'Grape', value: 'grape' }
];

const CheckboxMax = () => {
  const [maxValue, setMaxValue] = useState<string[]>([]);

  return (
    <View className="gap-3 bg-background p-4">
      <CheckboxGroup
        direction="horizontal"
        max={2}
        value={maxValue}
        onChange={setMaxValue}
      >
        {FRUIT_ITEMS.map(item => (
          <Checkbox
            key={item.value}
            name={item.value}
          >
            {item.label}
          </Checkbox>
        ))}
      </CheckboxGroup>
      <Text className="text-sm text-muted-foreground">Selected: {maxValue.join(', ') || 'none'}</Text>
    </View>
  );
};

export { CheckboxMax };
