import type { PickerOption } from '@skyroc/native-ui';
import { BottomSheetModal, Button, Cell, Picker } from '@skyroc/native-ui';
import type { ComponentRef } from 'react';
import { useRef, useState } from 'react';
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

const PickerTrigger = () => {
  const [regionShow, setRegionShow] = useState(false);
  const [regionValue, setRegionValue] = useState<string[]>([]);

  const sheetRef = useRef<ComponentRef<typeof BottomSheetModal>>(null);

  const regionLabel = regionValue.length > 0 ? regionValue.join(' / ') : '请选择';

  /** 先用 show 打开，再通过底层实例执行命令式关闭 */
  function handleOpenAndDismissByRef() {
    setRegionShow(true);
    setTimeout(() => sheetRef.current?.dismiss(), 2500);
  }

  return (
    <View className="bg-background p-4">
      <View className="overflow-hidden rounded-xl border border-border">
        <Picker
          ref={sheetRef}
          columns={REGIONS}
          show={regionShow}
          title="选择地区"
          value={regionValue}
          onConfirm={setRegionValue}
          onUpdateShow={setRegionShow}
        >
          {args => (
            <Cell
              showArrow
              title="所在地区"
              trailing={regionLabel}
              onPress={args.open}
            />
          )}
        </Picker>
      </View>
      <Button
        className="mt-3"
        variant="outline"
        onPress={handleOpenAndDismissByRef}
      >
        打开后用 ref 关闭
      </Button>
    </View>
  );
};

export { PickerTrigger };
