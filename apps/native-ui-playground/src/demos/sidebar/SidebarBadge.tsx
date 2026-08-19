import { Sidebar, Text } from '@skyroc/native-ui';
import type { SidebarItem } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const BADGE_ITEMS: SidebarItem[] = [
  { key: 'all', title: '全部' },
  { badge: 3, key: 'pending', title: '待付款' },
  { key: 'shipping', title: '待收货' },
  { dot: true, key: 'review', title: '待评价' },
  { badge: 128, key: 'refund', title: '退款' }
];

/** 右侧内容区属性 */
interface PanelProps {
  /** 正文说明 */
  description: string;

  /** 面板标题 */
  title: string;
}

const Panel = (props: PanelProps) => {
  const { description, title } = props;

  return (
    <View className="flex-1 items-center justify-center gap-2 p-4">
      <Text className="text-base font-semibold">{title}</Text>
      <Text className="text-center text-sm text-muted-foreground">{description}</Text>
    </View>
  );
};

const SidebarBadge = () => {
  const [badgeIndex, setBadgeIndex] = useState(1);

  return (
    <View className="bg-background p-4">
      <View className="h-56 flex-row overflow-hidden rounded-xl border border-border/60">
        <Sidebar
          className="self-stretch"
          defaultActiveIndex={1}
          items={BADGE_ITEMS}
          onIndexChange={setBadgeIndex}
        />
        <Panel
          description="badge 传数字、dot 传小红点，角标贴着标题而不是飞到整项右边缘"
          title={BADGE_ITEMS[badgeIndex].title as string}
        />
      </View>
    </View>
  );
};

export { SidebarBadge };
