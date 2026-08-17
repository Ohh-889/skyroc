import { Text } from '@skyroc/native-ui';
import type { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import {
  ButtonBlock,
  ButtonColor,
  ButtonDisabled,
  ButtonLoading,
  ButtonShape,
  ButtonSize,
  ButtonSlot,
  ButtonVariant
} from './button';

/**
 * Button 的总览页，逐节复用 ./button 下的单点 demo。
 * 文档站按节引用同一批文件（<Demo src="@playground/button/ButtonColor" />），
 * 所以这里只负责串场，不要把示例代码写回本文件。
 */
const ButtonDemo = () => {
  return (
    <ScrollView className="flex-1 bg-background">
      <Section title="Variants">
        <ButtonVariant />
      </Section>

      <Section title="Colors">
        <ButtonColor />
      </Section>

      <Section title="Sizes">
        <ButtonSize />
      </Section>

      <Section title="Shapes">
        <ButtonShape />
      </Section>

      <Section title="Block">
        <ButtonBlock />
      </Section>

      <Section title="Slots">
        <ButtonSlot />
      </Section>

      <Section title="Loading">
        <ButtonLoading />
      </Section>

      <Section title="Disabled">
        <ButtonDisabled />
      </Section>
    </ScrollView>
  );
};

interface SectionProps {
  /** 该节的 demo */
  children: ReactNode;

  /** 节标题 */
  title: string;
}

const Section = (props: SectionProps) => {
  const { children, title } = props;

  return (
    <View className="mb-2">
      <Text className="px-6 pt-6 text-lg font-semibold">{title}</Text>
      {children}
    </View>
  );
};

export { ButtonDemo };
