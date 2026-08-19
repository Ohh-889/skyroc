import { Text } from '@skyroc/native-ui';
import type { GridItemData } from '@skyroc/native-ui';
import { View } from 'react-native';

interface DemoIconProps {
  /** 图标中展示的简短标识 */
  label: string;
  /** 用于区分不同入口的语义色 */
  tone: 'info' | 'primary' | 'success' | 'warning';
}

/** 宫格里的占位图标。 Grid 的每个示例都要一整套入口数据，逐个文件复制一遍会淹没真正被演示的那几个 prop， 所以图标与示例数据统一放在这里。 */
const DemoIcon = (props: DemoIconProps) => {
  const { label, tone } = props;

  if (tone === 'success') {
    return (
      <View className="size-10 items-center justify-center rounded-2xl bg-success/10">
        <Text className="text-sm font-semibold text-success">{label}</Text>
      </View>
    );
  }
  if (tone === 'info') {
    return (
      <View className="size-10 items-center justify-center rounded-2xl bg-info/10">
        <Text className="text-sm font-semibold text-info">{label}</Text>
      </View>
    );
  }
  if (tone === 'warning') {
    return (
      <View className="size-10 items-center justify-center rounded-2xl bg-warning/10">
        <Text className="text-sm font-semibold text-warning">{label}</Text>
      </View>
    );
  }

  return (
    <View className="size-10 items-center justify-center rounded-2xl bg-primary/10">
      <Text className="text-sm font-semibold text-primary">{label}</Text>
    </View>
  );
};

const GRID_ITEMS: GridItemData[] = [
  {
    icon: (
      <DemoIcon
        label="扫"
        tone="primary"
      />
    ),
    key: 'scan',
    text: '扫一扫'
  },
  {
    icon: (
      <DemoIcon
        label="付"
        tone="success"
      />
    ),
    key: 'payment',
    text: '付款码'
  },
  {
    icon: (
      <DemoIcon
        label="转"
        tone="info"
      />
    ),
    key: 'transfer',
    text: '转账'
  },
  {
    icon: (
      <DemoIcon
        label="票"
        tone="warning"
      />
    ),
    key: 'invoice',
    text: '发票'
  },
  {
    icon: (
      <DemoIcon
        label="程"
        tone="info"
      />
    ),
    key: 'schedule',
    text: '日程'
  },
  {
    icon: (
      <DemoIcon
        label="旅"
        tone="warning"
      />
    ),
    key: 'travel',
    text: '差旅'
  },
  {
    icon: (
      <DemoIcon
        label="讯"
        tone="success"
      />
    ),
    key: 'contacts',
    text: '通讯录'
  },
  {
    icon: (
      <DemoIcon
        label="全"
        tone="primary"
      />
    ),
    key: 'all',
    text: '全部'
  }
];

const BASIC_ITEMS = GRID_ITEMS.slice(0, 4);

/** 末行不满，用来验证悬空竖线已经被裁掉 */
const SEVEN_ITEMS = GRID_ITEMS.slice(0, 7);

export { BASIC_ITEMS, DemoIcon, GRID_ITEMS, SEVEN_ITEMS };
