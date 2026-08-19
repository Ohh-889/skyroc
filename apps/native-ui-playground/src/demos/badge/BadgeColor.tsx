import { Badge, Text } from '@skyroc/native-ui';
import type { ReactNode } from 'react';
import { View } from 'react-native';

const COLORS = ['destructive', 'primary', 'secondary', 'success', 'warning', 'info'] as const;

const BadgeColor = () => {
  return (
    <View className="bg-background p-4">
      <Text className="mb-3 text-sm font-medium text-foreground">文字角标</Text>
      <View className="flex-row flex-wrap gap-x-3 gap-y-5">
        {COLORS.map(color => (
          <Sample
            key={color}
            label={color}
          >
            <Badge
              color={color}
              content={6}
            >
              <DemoTarget label="A" />
            </Badge>
          </Sample>
        ))}
      </View>

      <Text className="mb-3 mt-6 text-sm font-medium text-foreground">圆点角标</Text>
      <View className="flex-row flex-wrap gap-x-3 gap-y-5">
        {COLORS.map(color => (
          <Sample
            key={color}
            label={color}
          >
            <Badge
              dot
              color={color}
            >
              <DemoTarget label="A" />
            </Badge>
          </Sample>
        ))}
      </View>
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

export { BadgeColor };
