import { ScrollView } from 'react-native';
import { Section } from '@/src/components/Section';
import { PasswordInputBasic } from './PasswordInputBasic';
import { PasswordInputError } from './PasswordInputError';
import { PasswordInputLength } from './PasswordInputLength';
import { PasswordInputMask } from './PasswordInputMask';
import { PasswordInputNativeProps } from './PasswordInputNativeProps';
import { PasswordInputRef } from './PasswordInputRef';
import { PasswordInputSize } from './PasswordInputSize';
import { PasswordInputStyles } from './PasswordInputStyles';
import { PasswordInputVariant } from './PasswordInputVariant';

/**
 * PasswordInput 的总览页，逐节复用同目录下的单点 demo。 文档站按节引用同一批文件（<Demo src="@playground/password-input/PasswordInputBasic" />），
 * 所以这里只负责串场，不要把示例代码写回本文件。
 */
const PasswordInputDemo = () => {
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-4 pb-20"
      showsVerticalScrollIndicator={false}
    >
      <Section
        description="默认 6 位、掩码、数字键盘，输满后触发 onComplete。"
        title="基础用法（onComplete）"
      >
        <PasswordInputBasic />
      </Section>

      <Section
        description="merged 靠外框描边分隔，separated 每格独立描边并由 gutter 拉开间距。"
        title="外观变体（variant / gutter）"
      >
        <PasswordInputVariant />
      </Section>

      <Section
        description="size 同时驱动格子高度、掩码圆点尺寸与明文字号。"
        title="尺寸（size）"
      >
        <PasswordInputSize />
      </Section>

      <Section
        description="length 控制格子数量，两种变体都适用。"
        title="长度（length）"
      >
        <PasswordInputLength />
      </Section>

      <Section
        description="mask={false} 直接显示明文字符，字号跟随 size。"
        title="掩码（mask）"
      >
        <PasswordInputMask />
      </Section>

      <Section
        description="errorInfo 由当前值派生；有 errorInfo 时 info 不显示，边框同时转红。"
        title="提示与错误（info / errorInfo）"
      >
        <PasswordInputError />
      </Section>

      <Section
        description="ref 暴露 focus / blur，用于进入页面即弹键盘一类场景。"
        title="命令式 focus / blur（ref）"
      >
        <PasswordInputRef />
      </Section>

      <Section
        description="className 落在 root，classNames 按 security、cell、dot、symbol 逐槽覆盖。"
        title="样式覆盖（className / classNames）"
      >
        <PasswordInputStyles />
      </Section>

      <Section
        description="组件默认数字键盘且不自动大写；键盘、大小写与 editable 等原生属性均可透传。"
        title="原生属性透传（keyboardType / editable）"
      >
        <PasswordInputNativeProps />
      </Section>
    </ScrollView>
  );
};

export { PasswordInputDemo };
