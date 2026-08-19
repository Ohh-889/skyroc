import { ScrollView } from 'react-native';
import { Section } from '@/src/components/Section';
import { FormBasic } from './FormBasic';
import { FormComputed } from './FormComputed';
import { FormInteraction } from './FormInteraction';
import { FormLayout } from './FormLayout';
import { FormStyles } from './FormStyles';
import { FormValueAdapter } from './FormValueAdapter';

/** Form 的总览页，逐节复用同目录下的单点 demo。 文档站按节引用同一批文件（<Demo src="@playground/form/FormComputed" />）， 所以这里只负责串场，不要把示例代码写回本文件。 */
const FormDemo = () => {
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-4 pb-20"
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Section
        description="useForm 创建实例；initialValues 设置初值，rules、onFinish 和 onFinishFailed 组成完整校验提交链路。"
        title="基础与校验（Form / FormItem）"
      >
        <FormBasic />
      </Section>

      <Section
        description="getValueFromEvent 与 normalize 负责取值、转换；trigger 和 valuePropName 让 Switch 等控件接入表单。"
        title="值适配（getValueFromEvent / normalize）"
      >
        <FormValueAdapter />
      </Section>

      <Section
        description="labelAlign 控制上下或左右布局，labelWidth 调整标签列宽，size 提供三档密度。"
        title="标签布局（labelAlign / labelWidth / size）"
      >
        <FormLayout />
      </Section>

      <Section
        description="onPress 让整行可点并自动配合箭头；disabled 阻止行交互，trailing 放置尾部内容。"
        title="交互与禁用（onPress / disabled / trailing）"
      >
        <FormInteraction />
      </Section>

      <Section
        description="Form 的 classNames 覆盖分组 slot；FormItem 的 className / classNames 覆盖字段布局和文字。"
        title="样式覆盖（className / classNames）"
      >
        <FormStyles />
      </Section>

      <Section
        description="FormComputedField 监听 deps，并用 compute 生成始终只读的派生值。"
        title="计算字段（deps / compute）"
      >
        <FormComputed />
      </Section>
    </ScrollView>
  );
};

export { FormDemo };
