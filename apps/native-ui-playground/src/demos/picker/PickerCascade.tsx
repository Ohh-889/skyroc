import type { PickerOption } from '@skyroc/native-ui';
import { PickerView } from '@skyroc/native-ui';
import { View } from 'react-native';

/** 级联示例：省 → 市 → 区 */
const REGIONS: PickerOption[] = [
  {
    label: '浙江',
    value: 'zhejiang',
    children: [
      {
        label: '杭州',
        value: 'hangzhou',
        children: [
          { label: '西湖区', value: 'xihu' },
          { label: '滨江区', value: 'binjiang' },
          { label: '余杭区', value: 'yuhang' }
        ]
      },
      {
        label: '宁波',
        value: 'ningbo',
        children: [
          { label: '海曙区', value: 'haishu' },
          { label: '江北区', value: 'jiangbei' }
        ]
      }
    ]
  },
  {
    label: '江苏',
    value: 'jiangsu',
    children: [
      {
        label: '南京',
        value: 'nanjing',
        children: [
          { label: '玄武区', value: 'xuanwu' },
          { label: '鼓楼区', value: 'gulou' }
        ]
      },
      {
        label: '苏州',
        value: 'suzhou',
        children: [
          { label: '姑苏区', value: 'gusu' },
          { label: '虎丘区', value: 'huqiu' }
        ]
      }
    ]
  }
];

const PickerCascade = () => {
  return (
    <View className="bg-background px-6">
      <View className="mb-8">
        <PickerView
          columns={REGIONS}
          title="选择地区"
        />
      </View>
    </View>
  );
};

export { PickerCascade };
