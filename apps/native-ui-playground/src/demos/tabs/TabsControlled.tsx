import { Button, Tabs, Text } from '@skyroc/native-ui';
import type { TabItem } from '@skyroc/native-ui';
import { useState } from 'react';
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

const ITEMS: TabItem[] = ['第一步', '第二步', '第三步'].map((name, index) => ({
  children: (
    <Panel
      description={`当前是第 ${index + 1} 步，索引完全由外部 state 决定`}
      title={name}
    />
  ),
  key: name,
  title: name
}));

const TabsControlled = () => {
  const [step, setStep] = useState(0);

  return (
    <View className="gap-4 bg-background p-4">
      <View className="h-56 overflow-hidden rounded-xl border border-border/60">
        <Tabs
          activeIndex={step}
          items={ITEMS}
          type="pill"
          onIndexChange={setStep}
        />
      </View>
      <View className="flex-row flex-wrap items-center gap-3">
        <Button
          color="secondary"
          variant="outline"
          onPress={() => setStep(value => Math.max(0, value - 1))}
        >
          上一步
        </Button>
        <Button
          color="primary"
          variant="tonal"
          onPress={() => setStep(value => Math.min(ITEMS.length - 1, value + 1))}
        >
          下一步
        </Button>
        <Text className="text-sm text-muted-foreground">activeIndex：{step}</Text>
      </View>
    </View>
  );
};

export { TabsControlled };
