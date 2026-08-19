import { Button, Sidebar, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const CONTROLLED_ITEMS = ['基本信息', '收货地址', '支付方式', '发票信息'].map(title => ({ key: title, title }));

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

const SidebarControlled = () => {
  const [step, setStep] = useState(0);
  const [stepKey, setStepKey] = useState(CONTROLLED_ITEMS[0].key);

  return (
    <View className="bg-background p-4">
      <View className="mb-4 h-56 flex-row overflow-hidden rounded-xl border border-border/60">
        <Sidebar
          activeIndex={step}
          className="self-stretch"
          items={CONTROLLED_ITEMS}
          onIndexChange={(index, item) => {
            setStep(index);
            setStepKey(item.key);
          }}
        />
        <Panel
          description="激活索引完全由外部 state 决定"
          title={CONTROLLED_ITEMS[step].title}
        />
      </View>
      <View className="flex-row flex-wrap items-center gap-3">
        <Button
          color="secondary"
          variant="outline"
          onPress={() => setStep(value => Math.max(0, value - 1))}
        >
          上一项
        </Button>
        <Button
          color="primary"
          variant="tonal"
          onPress={() => setStep(value => Math.min(CONTROLLED_ITEMS.length - 1, value + 1))}
        >
          下一项
        </Button>
        <Text className="text-sm text-muted-foreground">
          index：{step} / key：{stepKey}
        </Text>
      </View>
    </View>
  );
};

export { SidebarControlled };
