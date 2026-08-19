import type { PickerOption } from '@skyroc/native-ui';
import { PickerView } from '@skyroc/native-ui';
import { View } from 'react-native';

/** 字段名映射示例：数据里根本没有 label / value / children 这几个 key */
const DEPARTMENTS: PickerOption[] = [
  {
    id: 'tech',
    name: '技术部',
    sub: [
      { id: 'fe', name: '前端组' },
      { id: 'be', name: '后端组' }
    ]
  },
  {
    id: 'design',
    name: '设计部',
    sub: [
      { id: 'ui', name: '视觉组' },
      { id: 'ux', name: '交互组' }
    ]
  }
];

const PickerFieldNames = () => {
  return (
    <View className="bg-background p-4">
      <PickerView
        columns={DEPARTMENTS}
        fieldNames={{ children: 'sub', label: 'name', value: 'id' }}
        title="选择部门"
      />
    </View>
  );
};

export { PickerFieldNames };
