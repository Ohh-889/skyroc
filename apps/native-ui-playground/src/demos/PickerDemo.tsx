import type { PickerOption } from '@skyroc/native-ui';
import { BottomSheetModal, Button, Cell, Picker, PickerView, Text } from '@skyroc/native-ui';
import type { ComponentRef } from 'react';
import { useEffect, useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';

/** 单列示例 */
const FRUITS: PickerOption[] = [
  { label: '苹果', value: 'apple' },
  { label: '香蕉', value: 'banana' },
  { label: '橘子', value: 'orange' },
  { label: '葡萄', value: 'grape' },
  { label: '西瓜', value: 'watermelon' },
  { label: '桃子', value: 'peach' },
  { label: '梨', value: 'pear' }
];

/** 带禁用项的单列示例 */
const SEATS: PickerOption[] = [
  { label: 'A 排（已满）', value: 'a', disabled: true },
  { label: 'B 排', value: 'b' },
  { label: 'C 排（已满）', value: 'c', disabled: true },
  { label: 'D 排（已满）', value: 'd', disabled: true },
  { label: 'E 排', value: 'e' },
  { label: 'F 排', value: 'f' }
];

const YEARS: PickerOption[] = Array.from({ length: 10 }, (_, i) => ({
  label: `${2020 + i} 年`,
  value: `${2020 + i}`
}));

const MONTHS: PickerOption[] = Array.from({ length: 12 }, (_, i) => ({
  label: `${i + 1} 月`,
  value: `${i + 1}`
}));

const DAYS: PickerOption[] = Array.from({ length: 31 }, (_, i) => ({
  label: `${i + 1} 日`,
  value: `${i + 1}`
}));

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

/** 异步加载的模拟耗时（ms） */
const MOCK_LOADING_DELAY = 1500;

const PickerDemo = () => {
  const [fruitShow, setFruitShow] = useState(false);
  const [fruitValue, setFruitValue] = useState<string[]>(['orange']);
  const [regionShow, setRegionShow] = useState(false);
  const [regionValue, setRegionValue] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const sheetRef = useRef<ComponentRef<typeof BottomSheetModal>>(null);

  const regionLabel = regionValue.length > 0 ? regionValue.join(' / ') : '请选择';

  function reload() {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, MOCK_LOADING_DELAY);
  }

  /** show 只能表达开/关，snapToIndex / expand 这类操作要靠 ref 拿到底层实例 */
  function handleDismissByRef() {
    sheetRef.current?.dismiss();
  }

  useEffect(() => {
    reload();
  }, []);

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-6 pb-20"
      showsVerticalScrollIndicator={false}
    >
      {/* 基础用法 */}
      <Text className="mb-2 text-lg font-semibold">基础用法</Text>
      <Text
        className="mb-4"
        color="muted"
      >
        单列内联选择器，haptic 打开后每滚过一格会有一次轻触反馈
      </Text>
      <View className="mb-8">
        <PickerView
          haptic
          columns={FRUITS}
          defaultValue={['orange']}
          showToolbar={false}
        />
      </View>

      {/* 多列 */}
      <Text className="mb-2 text-lg font-semibold">多列</Text>
      <Text
        className="mb-4"
        color="muted"
      >
        columns 传二维数组时各列相互独立，改一列不影响其它列
      </Text>
      <View className="mb-8">
        <PickerView
          columns={[YEARS, MONTHS, DAYS]}
          defaultValue={['2026', '2', '21']}
          title="选择日期"
        />
      </View>

      {/* 级联 */}
      <Text className="mb-2 text-lg font-semibold">级联</Text>
      <Text
        className="mb-4"
        color="muted"
      >
        选项带 children 即为级联；这里刻意不传 defaultValue，三列应当在首屏就全部展开
      </Text>
      <View className="mb-8">
        <PickerView
          columns={REGIONS}
          title="选择地区"
        />
      </View>

      {/* 自定义字段名 */}
      <Text className="mb-2 text-lg font-semibold">自定义字段名</Text>
      <Text
        className="mb-4"
        color="muted"
      >
        数据用的是 id / name / sub，靠 fieldNames 映射，显示文字与选中值都要跟着走
      </Text>
      <View className="mb-8">
        <PickerView
          columns={DEPARTMENTS}
          fieldNames={{ children: 'sub', label: 'name', value: 'id' }}
          title="选择部门"
        />
      </View>

      {/* 禁用项 */}
      <Text className="mb-2 text-lg font-semibold">禁用项</Text>
      <Text
        className="mb-4"
        color="muted"
      >
        停在禁用项上会自动吸附到最近的可选项，连着几个禁用也能跨过去
      </Text>
      <View className="mb-8">
        <PickerView
          columns={SEATS}
          showToolbar={false}
        />
      </View>

      {/* 加载中 */}
      <Text className="mb-2 text-lg font-semibold">加载中</Text>
      <Text
        className="mb-4"
        color="muted"
      >
        loading 只盖住滚轮区域，工具栏仍然可点
      </Text>
      <View className="mb-4">
        <Button
          variant="tonal"
          onPress={reload}
        >
          重新加载
        </Button>
      </View>
      <View className="mb-8">
        <PickerView
          columns={loading ? [] : FRUITS}
          defaultValue={['apple']}
          loading={loading}
          showToolbar={false}
        />
      </View>

      {/* 弹层用法 */}
      <Text className="mb-2 text-lg font-semibold">弹层用法</Text>
      <Text
        className="mb-4"
        color="muted"
      >
        滚动过程中的值是临时的，点「确定」才会写回 value，点「取消」直接丢弃
      </Text>
      <View className="mb-8 flex-row flex-wrap items-center gap-3">
        <Button
          variant="tonal"
          onPress={() => setFruitShow(true)}
        >
          打开选择器
        </Button>
        <Text color="muted">当前：{fruitValue.join(', ') || '未选择'}</Text>

        <Picker
          columns={FRUITS}
          show={fruitShow}
          title="选择水果"
          value={fruitValue}
          onConfirm={setFruitValue}
          onUpdateShow={setFruitShow}
        />
      </View>

      {/* 触发元素与 ref */}
      <Text className="mb-2 text-lg font-semibold">触发元素与 ref</Text>
      <Text
        className="mb-4"
        color="muted"
      >
        children 传函数就能自己画触发元素；ref 拿到的是底层 BottomSheetModal，show 表达不了的命令式操作走它
      </Text>
      <View className="mb-8">
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

        <Button
          className="mt-3"
          variant="outline"
          onPress={handleDismissByRef}
        >
          用 ref 关掉面板
        </Button>
      </View>
    </ScrollView>
  );
};

export { PickerDemo };
