import { ScrollView } from 'react-native';
import { Section } from '@/src/components/Section';
import { FieldBasic } from './FieldBasic';
import { FieldSize } from './FieldSize';

/**
 * Field 的总览页，逐节复用同目录下的单点 demo。 文档站按节引用同一批文件（<Demo src="@playground/field/FieldBasic" />），
 * 所以这里只负责串场，不要把示例代码写回本文件。
 */
const FieldDemo = () => {
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-4 pb-20"
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Section
        description="FieldGroup 承载表单状态，FieldItem 的 required 让星号与校验规则同源。"
        title="基础用法（FieldGroup / FieldItem）"
      >
        <FieldBasic />
      </Section>

      <Section
        description="size 逐项控制字段密度；非文本控件的 onChange 第一个参数就是值。"
        title="尺寸（size）"
      >
        <FieldSize />
      </Section>
    </ScrollView>
  );
};

export { FieldDemo };
