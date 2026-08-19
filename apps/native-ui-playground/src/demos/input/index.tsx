import { ScrollView } from 'react-native';
import { Section } from '@/src/components/Section';
import { InputBasic } from './InputBasic';
import { InputClearable } from './InputClearable';
import { InputControlled } from './InputControlled';
import { InputDisabled } from './InputDisabled';
import { InputError } from './InputError';
import { InputInline } from './InputInline';
import { InputNativeProps } from './InputNativeProps';
import { InputPassword } from './InputPassword';
import { InputSize } from './InputSize';
import { InputSlot } from './InputSlot';
import { InputStyles } from './InputStyles';
import { InputVariant } from './InputVariant';

/**
 * Input 的总览页，逐节复用同目录下的单点 demo。 文档站按节引用同一批文件（<Demo src="@playground/input/InputBasic" />），
 * 所以这里只负责串场，不要把示例代码写回本文件。
 */
const InputDemo = () => {
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-4 pb-20"
      showsVerticalScrollIndicator={false}
    >
      <Section
        description="placeholder 与 defaultValue 覆盖最常见的非受控用法。"
        title="基础用法"
      >
        <InputBasic />
      </Section>

      <Section
        description="variant 提供 outline、filled、underline 和 none 四种外观。"
        title="外观变体（variant）"
      >
        <InputVariant />
      </Section>

      <Section
        description="size 提供 sm、md、lg 三档高度与字号。"
        title="尺寸（size）"
      >
        <InputSize />
      </Section>

      <Section
        description="error 在未聚焦时同样是红框，且优先级高于聚焦色。"
        title="错误态（error）"
      >
        <InputError />
      </Section>

      <Section
        description="disabled 下不可编辑，清除、密码等功能按钮也不响应点击。"
        title="禁用（disabled）"
      >
        <InputDisabled />
      </Section>

      <Section
        description="clearable 在受控与非受控下都能真正清空，并触发 onClear。"
        title="清除按钮（clearable / onClear）"
      >
        <InputClearable />
      </Section>

      <Section
        description="type=password 自带可见性切换，也可以用 passwordVisible 接管。"
        title="密码框（type / passwordVisible）"
      >
        <InputPassword />
      </Section>

      <Section
        description="leading、trailing 放置图标或单位，trailing 与密码按钮共存且排在其后。"
        title="前后插槽（leading / trailing）"
      >
        <InputSlot />
      </Section>

      <Section
        description="value 与 onChangeText 接管输入值，可配合 error 做实时校验。"
        title="受控（value / onChangeText）"
      >
        <InputControlled />
      </Section>

      <Section
        description="variant=none 去掉自身边框，需要靠右时由调用方传 textAlign。"
        title="Cell 内联（variant=none）"
      >
        <InputInline />
      </Section>

      <Section
        description="className 落在 root，classNames 按 control、action 等槽位逐个覆盖。"
        title="样式覆盖（className / classNames）"
      >
        <InputStyles />
      </Section>

      <Section
        description="keyboardType、maxLength、multiline 等原生属性直接透传给底层 TextInput。"
        title="原生属性透传"
      >
        <InputNativeProps />
      </Section>
    </ScrollView>
  );
};

export { InputDemo };
