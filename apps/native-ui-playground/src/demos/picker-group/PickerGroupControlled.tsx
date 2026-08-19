import type { PickerGroupItem, PickerOption } from '@skyroc/native-ui';
import { Button, PickerGroupView, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const COLORS: PickerOption[] = [
  { label: '红色', value: 'red' },
  { label: '绿色', value: 'green' },
  { label: '蓝色', value: 'blue' }
];

const SIZES: PickerOption[] = [
  { label: '小', value: 'sm' },
  { label: '中', value: 'md' },
  { label: '大', value: 'lg' }
];

const CONTROLLED_PICKERS: PickerGroupItem[] = [
  { columns: COLORS, key: 'color', title: '颜色' },
  { columns: SIZES, key: 'size', title: '尺寸' }
];

const PickerGroupControlled = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [values, setValues] = useState<string[][]>([['green'], ['md']]);

  function selectFirstTab() {
    setActiveTab(0);
  }

  function selectSecondTab() {
    setActiveTab(1);
  }

  return (
    <View className="gap-3 bg-background px-4 pb-4">
      <View className="flex-row gap-2">
        <Button
          size="sm"
          variant="outline"
          onPress={selectFirstTab}
        >
          颜色
        </Button>
        <Button
          size="sm"
          variant="outline"
          onPress={selectSecondTab}
        >
          尺寸
        </Button>
      </View>
      <Text color="muted">
        activeTab：{activeTab}；values：{JSON.stringify(values)}
      </Text>
      <PickerGroupView
        activeTab={activeTab}
        pickers={CONTROLLED_PICKERS}
        values={values}
        onChange={setValues}
        onTabChange={setActiveTab}
      />
    </View>
  );
};

export { PickerGroupControlled };
