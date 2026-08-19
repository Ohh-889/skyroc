import { Tabs, Text } from '@skyroc/native-ui';
import type { TabItem } from '@skyroc/native-ui';
import { View } from 'react-native';

/** 面板占位内容属性 */
interface PanelProps {
  /** 正文说明 */
  description: string;

  /** 面板标题 */
  title: string;
}

const Panel = (props: PanelProps) => {
  const { description, title } = props;

  return (
    <View className="flex-1 items-center justify-center gap-2 p-6">
      <Text className="text-base font-semibold">{title}</Text>
      <Text className="text-center text-sm text-muted-foreground">{description}</Text>
    </View>
  );
};

const ITEMS: TabItem[] = [
  {
    children: (
      <Panel
        description="pill 型指示器撑满 tab 高度，作为选中态背景"
        title="全部"
      />
    ),
    key: 'all',
    title: '全部'
  },
  {
    children: (
      <Panel
        description="tabBar 自身带底色与内边距，tab 等分宽度"
        title="进行中"
      />
    ),
    key: 'ongoing',
    title: '进行中'
  },
  {
    children: (
      <Panel
        description="指示器先于文字渲染，靠绘制顺序压在下层"
        title="已完成"
      />
    ),
    key: 'done',
    title: '已完成'
  }
];

const TabsPill = () => {
  return (
    <View className="bg-background p-4">
      <View className="h-56 overflow-hidden rounded-xl border border-border/60">
        <Tabs
          items={ITEMS}
          type="pill"
        />
      </View>
    </View>
  );
};

export { TabsPill };
