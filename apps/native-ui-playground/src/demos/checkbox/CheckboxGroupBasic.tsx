import { Checkbox, CheckboxGroup, Text } from '@skyroc/native-ui';
import type { CheckedState } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const FRUIT_ITEMS = [
  { label: 'Apple', value: 'apple' },
  { label: 'Orange', value: 'orange' },
  { label: 'Banana', value: 'banana' },
  { label: 'Grape', value: 'grape' }
];

const CheckboxGroupBasic = () => {
  const [groupValue, setGroupValue] = useState<string[]>(['apple']);
  const [lastChanged, setLastChanged] = useState('-');

  // 全选 / 半选：父级选中态由子集数量推导
  const parentChecked: CheckedState =
    groupValue.length === 0 ? false : groupValue.length === FRUIT_ITEMS.length || 'indeterminate';

  function handleToggleAll(checked: boolean) {
    setGroupValue(checked ? FRUIT_ITEMS.map(item => item.value) : []);
  }

  return (
    <View className="gap-3 bg-background p-4">
      <Checkbox
        checked={parentChecked}
        onCheckedChange={handleToggleAll}
      >
        Check all
      </Checkbox>

      <CheckboxGroup
        className="pl-6"
        value={groupValue}
        onChange={setGroupValue}
      >
        {FRUIT_ITEMS.map(item => (
          <Checkbox
            key={item.value}
            name={item.value}
            onCheckedChange={checked => setLastChanged(`${item.label} → ${checked}`)}
          >
            {item.label}
          </Checkbox>
        ))}
      </CheckboxGroup>

      <Text className="text-sm text-muted-foreground">Selected: {groupValue.join(', ') || 'none'}</Text>
      <Text className="text-sm text-muted-foreground">Last changed: {lastChanged}</Text>
    </View>
  );
};

export { CheckboxGroupBasic };
