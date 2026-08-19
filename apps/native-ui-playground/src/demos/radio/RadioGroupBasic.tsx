import { Radio, RadioGroup, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const FRUIT_ITEMS = [
  { label: '未指定（空字符串）', value: '' },
  { label: '苹果', value: 'apple' },
  { label: '橙子', value: 'orange' },
  { label: '香蕉', value: 'banana' }
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
      <Text className="text-sm text-muted-foreground">当前值：{groupValue || "''"}</Text>
    </View>
  );
};

export { RadioGroupBasic };
