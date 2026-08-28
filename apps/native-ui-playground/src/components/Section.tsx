import { Divider, Text } from '@skyroc/native-ui';
import type { ReactNode } from 'react';
import { View } from 'react-native';

interface SectionProps {
  /** 当前特性的示例内容 */
  children: ReactNode;

  /** 当前示例所聚焦 API 的简短说明 */
  description: string;

  /** 当前特性标题 */
  title: string;
}

/** Demo 总览页的统一段落容器：标题 + 说明 + 示例卡片 */
const Section = (props: SectionProps) => {
  const { children, description, title } = props;

  return (
    <View className="mb-6 overflow-hidden rounded-2xl border border-border bg-background">
      <View className="p-4">
        <Text className="text-lg font-semibold text-foreground">{title}</Text>
        <Text className="mt-1 text-sm leading-5 text-muted-foreground">{description}</Text>
      </View>
      <Divider />
      {children}
    </View>
  );
};

export { Section };
export type { SectionProps };
