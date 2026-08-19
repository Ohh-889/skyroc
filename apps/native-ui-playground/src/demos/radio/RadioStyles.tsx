import { Radio, RadioGroupCard } from '@skyroc/native-ui';
import { View } from 'react-native';

const STYLE_ITEMS = [
  { description: '使用统一的卡片 slot 样式', label: '选项 A', value: 'a' },
  { description: '单项禁用状态仍然保留', disabled: true, label: '选项 B', value: 'b' }
];

const RadioStyles = () => {
  return (
    <View className="gap-4 bg-background p-4">
      <Radio
        className="rounded-xl bg-primary-50 p-3"
        classNames={{ dot: 'bg-success', indicator: 'border-success', label: 'font-semibold text-primary' }}
        defaultChecked
      >
        自定义单选项样式
      </Radio>
      <RadioGroupCard
        defaultValue="a"
        itemClassNames={{ label: 'text-primary', root: 'border-primary-200 bg-primary-50' }}
        items={STYLE_ITEMS}
      />
    </View>
  );
};

export { RadioStyles };
