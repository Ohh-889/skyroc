import { Badge, Text } from '@skyroc/native-ui';
import type { ReactNode } from 'react';
import { View } from 'react-native';

const BadgeStyles = () => {
  return (
    <View className="flex-row flex-wrap gap-x-3 gap-y-5 bg-background p-4">
      <Sample label="ReactElement">
        <Badge content={<Text className="px-1 text-2xs font-bold text-destructive-foreground">HOT</Text>}>
          <DemoTarget label="A" />
        </Badge>
      </Sample>
      <Sample label="badge / content">
        <Badge
          classNames={{ badge: 'rounded-md', content: 'font-normal' }}
          color="info"
          content={9}
        >
          <DemoTarget label="B" />
        </Badge>
      </Sample>
      <Sample label="dot">
        <Badge
          dot
          classNames={{ dot: 'h-3 w-3' }}
          color="success"
        >
          <DemoTarget label="C" />
        </Badge>
      </Sample>
      <Sample label="root">
        <Badge
          classNames={{ root: 'rounded-xl bg-muted p-2' }}
          content={2}
        >
          <DemoTarget label="D" />
        </Badge>
      </Sample>
    </View>
  );
};

interface DemoTargetProps {
  /** 用于区分示例目标的简短标记 */
  label: string;
}

/** 模拟头像、图标等被角标标记的内容 */
const DemoTarget = (props: DemoTargetProps) => {
  const { label } = props;

  return (
    <View className="h-12 w-12 items-center justify-center rounded-xl bg-muted">
      <Text className="text-sm font-semibold text-muted-foreground">{label}</Text>
    </View>
  );
};

interface SampleProps {
  /** 当前示例内容 */
  children: ReactNode;

  /** 示例下方的 API 值说明 */
  label: string;
}

const Sample = (props: SampleProps) => {
  const { children, label } = props;

  return (
    <View className="w-20 items-center gap-2">
      {children}
      <Text className="text-center text-xs text-muted-foreground">{label}</Text>
    </View>
  );
};

export { BadgeStyles };
