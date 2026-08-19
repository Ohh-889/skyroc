import { ScrollView } from 'react-native';
import { Section } from '@/src/components/Section';
import { FieldBasic } from './FieldBasic';
import { FieldBinding } from './FieldBinding';
import { FieldControls } from './FieldControls';
import { FieldGap } from './FieldGap';
import { FieldSize } from './FieldSize';
import { FieldStyles } from './FieldStyles';
import { FieldTransform } from './FieldTransform';
import { FieldValidation } from './FieldValidation';

/** Field 的总览页，逐节复用同目录下的单点 demo。 文档站按节引用同一批文件（<Demo src="@playground/field/FieldBasic" />）， 所以这里只负责串场，不要把示例代码写回本文件。 */
const FieldDemo = () => {
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-4 pb-20"
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Section
        description="FieldGroup 承载表单状态，FieldItem 负责标签、控件、提示与错误布局。"
        title="基础用法（FieldGroup / FieldItem）"
      >
        <FieldBasic />
      </Section>

      <Section
        description="rules 中的 required 会自动显示星号；validateTrigger=false 延迟到提交时校验。"
        title="必填与校验（rules / validateTrigger）"
      >
        <FieldValidation />
      </Section>

      <Section
        description="size 提供 sm、md、lg 三档标签、错误和描述排版；控件尺寸由子组件单独设置。"
        title="尺寸（size）"
      >
        <FieldSize />
      </Section>

      <Section
        description="默认取 onChange 的第一个参数，Rate、Stepper 等非文本控件无需额外配置。"
        title="非文本控件"
      >
        <FieldControls />
      </Section>

      <Section
        description="trigger 与 valuePropName 可接入非 value / onChange 约定的受控组件。"
        title="自定义值绑定（trigger / valuePropName）"
      >
        <FieldBinding />
      </Section>

      <Section
        description="normalize 转换保存值；getValueProps 只转换传给子组件的显示值。"
        title="值转换（normalize / getValueProps）"
      >
        <FieldTransform />
      </Section>

      <Section
        description="gap 使用 Tailwind 标准间距档位统一控制 FieldGroup 子项距离。"
        title="字段间距（gap）"
      >
        <FieldGap />
      </Section>

      <Section
        description="FieldGroup 与 FieldItem 都支持 className 和 classNames slot 覆盖。"
        title="样式覆盖（className / classNames）"
      >
        <FieldStyles />
      </Section>
    </ScrollView>
  );
};

export { FieldDemo };
