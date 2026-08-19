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
        description="line 型指示器贴在 tabBar 底部，宽度跟随激活项"
        title="推荐"
      />
    ),
    key: 'recommend',
    title: '推荐'
  },
  {
    children: (
      <Panel
        description="左右滑动面板即可切换，指示器与滚动位置会跟着动"
        title="关注"
      />
    ),
    key: 'following',
    title: '关注'
  },
  {
    children: (
      <Panel
        description="点击 tab 与手势滑动共用同一份激活索引"
        title="热榜"
      />
    ),
    key: 'hot',
    title: '热榜'
  }
];

const TabsBasic = () => {
  return (
    <View className="bg-background p-4">
      <View className="h-56 overflow-hidden rounded-xl border border-border/60">
        <Tabs items={ITEMS} />
      </View>
    </View>
  );
};

export { TabsBasic };
