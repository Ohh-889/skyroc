import { ScrollView } from 'react-native';
import { Section } from '@/src/components/Section';
import { ActionSheetBasic } from './ActionSheetBasic';
import { ActionSheetButton } from './ActionSheetButton';
import { ActionSheetCloseable } from './ActionSheetCloseable';
import { ActionSheetControlled } from './ActionSheetControlled';
import { ActionSheetImperative } from './ActionSheetImperative';
import { ActionSheetStatus } from './ActionSheetStatus';
import { ActionSheetStyles } from './ActionSheetStyles';

/**
 * ActionSheet 的总览页，逐节复用同目录下的单点 demo。 文档站按节引用同一批文件（<Demo src="@playground/action-sheet/ActionSheetBasic" />），
 * 所以这里只负责串场，不要把示例代码写回本文件。
 */
const ActionSheetDemo = () => {
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-4 pb-20"
      showsVerticalScrollIndicator={false}
    >
      <Section
        description="actions 定义选项；defaultValue 设置初始选中项，选择或取消后自动关闭。"
        title="基础用法（actions / defaultValue）"
      >
        <ActionSheetBasic />
      </Section>

      <Section
        description="单个 action 支持 subname、disabled、loading 和 color。"
        title="选项状态（ActionSheetAction）"
      >
        <ActionSheetStatus />
      </Section>

      <Section
        description="variant=button 使用卡片式操作项，并渲染 action.icon。"
        title="按钮变体（variant / icon）"
      >
        <ActionSheetButton />
      </Section>

      <Section
        description="value 与 onChange 控制选中值；children render prop 提供 action、value 和 toggle。"
        title="受控选择（value / children）"
      >
        <ActionSheetControlled />
      </Section>

      <Section
        description="关闭遮罩、下拉和顶部按钮后，面板只能通过选项或底部取消按钮退出。"
        title="关闭行为（closeable / closeOnBackdropPress）"
      >
        <ActionSheetCloseable />
      </Section>

      <Section
        description="classNames 控制操作列表 slot，sheetClassNames 控制内部 Sheet。"
        title="样式覆盖（classNames / sheetClassNames）"
      >
        <ActionSheetStyles />
      </Section>

      <Section
        description="showActionSheet 返回选择结果；closeActionSheet 可从外部关闭当前面板。"
        title="命令式调用（showActionSheet）"
      >
        <ActionSheetImperative />
      </Section>
    </ScrollView>
  );
};

export { ActionSheetDemo };
