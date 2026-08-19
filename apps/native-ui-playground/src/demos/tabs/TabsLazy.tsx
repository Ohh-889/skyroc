import { Tabs, Text } from '@skyroc/native-ui';
import type { TabItem } from '@skyroc/native-ui';
import { useRef } from 'react';
import { View } from 'react-native';

/** 懒加载面板属性 */
interface LazyPanelProps {
  /** 面板标题 */
  title: string;
}

/** 记录首次挂载时刻，用于验证「加载后常驻、切走不卸载」 */
const LazyPanel = (props: LazyPanelProps) => {
  const { title } = props;

  const mountedAtRef = useRef(new Date().toLocaleTimeString());

  return (
    <View className="flex-1 items-center justify-center gap-2 p-6">
      <Text className="text-base font-semibold">{title}</Text>
      <Text className="text-sm text-muted-foreground">挂载于 {mountedAtRef.current}</Text>
      <Text className="text-center text-xs text-muted-foreground">来回切换，时间不变说明面板没有被卸载重建</Text>
    </View>
  );
};

const ITEMS: TabItem[] = ['日报', '周报', '月报', '年报'].map(name => ({
  children: <LazyPanel title={name} />,
  key: name,
  title: name
}));

const TabsLazy = () => {
  return (
    <View className="bg-background p-4">
      <View className="h-56 overflow-hidden rounded-xl border border-border/60">
        <Tabs
          lazy
          items={ITEMS}
          lazyPreloadDistance={1}
          renderLazyPlaceholder={() => (
            <View className="flex-1 items-center justify-center">
              <Text className="text-sm text-muted-foreground">尚未加载</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
};

export { TabsLazy };
