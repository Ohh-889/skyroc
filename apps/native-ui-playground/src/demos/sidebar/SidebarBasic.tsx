import { Sidebar, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const BASIC_ITEMS = ['推荐', '手机数码', '家用电器', '男装', '女装', '生鲜'].map(title => ({ key: title, title }));

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

const SidebarBasic = () => {
  const [basicIndex, setBasicIndex] = useState(0);

  return (
    <View className="bg-background p-4">
      <View className="h-56 flex-row overflow-hidden rounded-xl border border-border/60">
        <Sidebar
          className="self-stretch"
          items={BASIC_ITEMS}
          onIndexChange={setBasicIndex}
        />
        <Panel
          description="指示器落在激活项的垂直中心，切换时做位移动画"
          title={BASIC_ITEMS[basicIndex].title}
        />
      </View>
    </View>
  );
};

export { SidebarBasic };
