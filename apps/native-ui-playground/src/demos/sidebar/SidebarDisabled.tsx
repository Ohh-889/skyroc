import { Sidebar, Text } from '@skyroc/native-ui';
import type { SidebarItem } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const DISABLED_ITEMS: SidebarItem[] = [
  { key: 'draft', title: '草稿' },
  { disabled: true, key: 'reviewing', title: '审核中' },
  { key: 'published', title: '已发布' },
  { disabled: true, key: 'archived', title: '已下架' }
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

const SidebarDisabled = () => {
  const [disabledIndex, setDisabledIndex] = useState(0);

  return (
    <View className="bg-background p-4">
      <View className="h-56 flex-row overflow-hidden rounded-xl border border-border/60">
        <Sidebar
          className="self-stretch"
          items={DISABLED_ITEMS}
          onIndexChange={setDisabledIndex}
        />
        <Panel
          description="禁用项整体降透明度且不响应点击"
          title={DISABLED_ITEMS[disabledIndex].title as string}
        />
      </View>
    </View>
  );
};

export { SidebarDisabled };
