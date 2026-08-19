import { Sidebar, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const SCROLL_ITEMS = Array.from({ length: 20 }, (_, index) => `分类 ${String(index + 1).padStart(2, '0')}`).map(
  title => ({ key: title, title })
);

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

const SidebarScrollable = () => {
  const [scrollIndex, setScrollIndex] = useState(11);

  return (
    <View className="bg-background p-4">
      <View className="h-56 flex-row overflow-hidden rounded-xl border border-border/60">
        <Sidebar
          className="self-stretch"
          defaultActiveIndex={11}
          items={SCROLL_ITEMS}
          onIndexChange={setScrollIndex}
        />
        <Panel
          description="默认激活第 12 项，向下滚动即可看到指示器"
          title={SCROLL_ITEMS[scrollIndex].title}
        />
      </View>
    </View>
  );
};

export { SidebarScrollable };
