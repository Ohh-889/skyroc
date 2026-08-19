import { ScrollView } from 'react-native';
import { Section } from '@/src/components/Section';
import { DialogBasic } from './DialogBasic';
import { DialogBeforeClose } from './DialogBeforeClose';
import { DialogButtons } from './DialogButtons';
import { DialogCloseMode } from './DialogCloseMode';
import { DialogCustomContent } from './DialogCustomContent';
import { DialogDeclarative } from './DialogDeclarative';
import { DialogInput } from './DialogInput';
import { DialogMessageAlign } from './DialogMessageAlign';
import { DialogStyles } from './DialogStyles';
import { DialogTheme } from './DialogTheme';

/** Dialog 的总览页，逐节复用同目录下的单点 demo。 文档站按节引用同一批文件（<Demo src="@playground/dialog/DialogTheme" />）， 所以这里只负责串场，不要把示例代码写回本文件。 */
const DialogDemo = () => {
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-4 pb-20"
      showsVerticalScrollIndicator={false}
    >
      <Section
        description="showDialog 显示提示框；showConfirmDialog 默认补充取消按钮。"
        title="基础用法（showDialog / showConfirmDialog）"
      >
        <DialogBasic />
      </Section>

      <Section
        description="可配置按钮显隐、文案、危险操作颜色，并单独禁用确认按钮。"
        title="按钮配置与状态（showCancelButton / confirmButtonDisabled）"
      >
        <DialogButtons />
      </Section>

      <Section
        description="messageAlign 支持 left、center 和 right，默认居中。"
        title="消息对齐（messageAlign）"
      >
        <DialogMessageAlign />
      </Section>

      <Section
        description="theme=round-button 使用胶囊按钮，themeDirection 控制横排或竖排。"
        title="主题与方向（theme / themeDirection）"
      >
        <DialogTheme />
      </Section>

      <Section
        description="showInput 默认启用 avoidKeyboard，并支持默认值和受控值；输入变化与确认回调都会携带当前内容。"
        title="输入模式（showInput / inputValue）"
      >
        <DialogInput />
      </Section>

      <Section
        description="beforeClose 可同步阻止关闭，也可返回 Promise；等待期间触发按钮显示 loading。"
        title="关闭拦截（beforeClose）"
      >
        <DialogBeforeClose />
      </Section>

      <Section
        description="遮罩、Android 返回键和 closeDialog 可独立控制；外部关闭都按 cancel 结算。"
        title="关闭方式（closeOnBackdropPress / closeOnBackPress）"
      >
        <DialogCloseMode />
      </Section>

      <Section
        description="onOpened 与 onClosed 在动画结束后触发，可用于观察完整展示周期。"
        title="声明式受控与生命周期（show / onUpdateShow）"
      >
        <DialogDeclarative />
      </Section>

      <Section
        description="children 可追加任意内容，不影响 title、message 与底部操作区。"
        title="自定义内容（children）"
      >
        <DialogCustomContent />
      </Section>

      <Section
        description="className 覆盖卡片根节点，classNames 可分别调整 popup、标题、正文与按钮等 slot。"
        title="样式覆盖（className / classNames）"
      >
        <DialogStyles />
      </Section>
    </ScrollView>
  );
};

export { DialogDemo };
