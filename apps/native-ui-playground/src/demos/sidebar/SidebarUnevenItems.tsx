import { Sidebar, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

/** 项高故意不一致：多行标题、单行标题混排，用来验证指示器逐项测量而不是按首项高度推算 */
const UNEVEN_ITEMS = ['热销', '家庭清洁 / 纸品', '个护', '医药健康与营养品', '母婴'].map(title => ({
  key: title,
  title
}));

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

const SidebarUnevenItems = () => {
  const [unevenIndex, setUnevenIndex] = useState(3);

  return (
    <View className="bg-background p-4">
      <View className="h-56 flex-row overflow-hidden rounded-xl border border-border/60">
        <Sidebar
          className="w-24 self-stretch"
          defaultActiveIndex={3}
          items={UNEVEN_ITEMS}
          onIndexChange={setUnevenIndex}
        />
        <Panel
          description="试着点最后一项再点第二项，指示器不会越对越偏"
          title={UNEVEN_ITEMS[unevenIndex].title}
        />
      </View>
    </View>
  );
};

export { SidebarUnevenItems };
