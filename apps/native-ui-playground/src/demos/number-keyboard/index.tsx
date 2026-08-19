import { ScrollView } from 'react-native';
import { Section } from '@/src/components/Section';
import { NumberKeyboardBasic } from './NumberKeyboardBasic';
import { NumberKeyboardCustomDelete } from './NumberKeyboardCustomDelete';
import { NumberKeyboardCustomTheme } from './NumberKeyboardCustomTheme';
import { NumberKeyboardEvents } from './NumberKeyboardEvents';
import { NumberKeyboardExtraKey } from './NumberKeyboardExtraKey';
import { NumberKeyboardHideDelete } from './NumberKeyboardHideDelete';
import { NumberKeyboardMaxLength } from './NumberKeyboardMaxLength';
import { NumberKeyboardNonModal } from './NumberKeyboardNonModal';
import { NumberKeyboardRandomOrder } from './NumberKeyboardRandomOrder';
import { NumberKeyboardSafeArea } from './NumberKeyboardSafeArea';
import { NumberKeyboardStyles } from './NumberKeyboardStyles';
import { NumberKeyboardTitle } from './NumberKeyboardTitle';
import { NumberKeyboardTwoExtraKeys } from './NumberKeyboardTwoExtraKeys';
import { NumberKeyboardUncontrolled } from './NumberKeyboardUncontrolled';

/**
 * NumberKeyboard 的总览页，逐节复用同目录下的单点 demo。 文档站按节引用同一批文件（<Demo src="@playground/number-keyboard/NumberKeyboardCustomTheme"
 * />）， 所以这里只负责串场，不要把示例代码写回本文件。
 */
const NumberKeyboardDemo = () => {
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-4 pb-20"
      showsVerticalScrollIndicator={false}
    >
      <Section
        description="受控输入，点击键盘外部收起。"
        title="基础用法"
      >
        <NumberKeyboardBasic />
      </Section>

      <Section
        description="标题栏左右等宽，标题始终居中。"
        title="标题与关闭按钮（title / closeButtonText）"
      >
        <NumberKeyboardTitle />
      </Section>

      <Section
        description="default 主题把额外键放在左下角。"
        title="额外按键（extraKey）"
      >
        <NumberKeyboardExtraKey />
      </Section>

      <Section
        description="右侧竖排功能区，删除键占 1 份高度、完成键占 3 份。"
        title="custom 主题（theme）"
      >
        <NumberKeyboardCustomTheme />
      </Section>

      <Section
        description="custom 主题下 0 两侧各放一个额外键。"
        title="两个额外按键（extraKey）"
      >
        <NumberKeyboardTwoExtraKeys />
      </Section>

      <Section
        description="每次打开重新洗牌，收起途中顺序不变。"
        title="随机键序（randomKeyOrder）"
      >
        <NumberKeyboardRandomOrder />
      </Section>

      <Section
        description="输满 6 位后继续按键不再有反应。"
        title="限制长度（maxLength）"
      >
        <NumberKeyboardMaxLength />
      </Section>

      <Section
        description="deleteButtonText 替换默认退格符号；隐藏后仍保留占位格，网格不会塌陷。"
        title="删除键（deleteButtonText / showDeleteKey）"
      >
        <NumberKeyboardHideDelete />
      </Section>

      <Section
        description="renderDelete 覆盖默认退格符号；按下后仍遵循组件的单字符删除行为。"
        title="自定义删除内容（renderDelete）"
      >
        <NumberKeyboardCustomDelete />
      </Section>

      <Section
        description="分别观察按键输入、删除、点击外部与点击关闭按钮时触发的事件。"
        title="事件回调（onInput / onDelete / onBlur / onClose）"
      >
        <NumberKeyboardEvents />
      </Section>

      <Section
        description="键盘不做模态遮挡，打开后页面上的测试按钮仍可直接点击。"
        title="外部保持可点（hideOnClickOutside）"
      >
        <NumberKeyboardNonModal />
      </Section>

      <Section
        description="不传 value，输入值由键盘自己持有；每次打开用新的 key 创建独立输入会话。"
        title="非受控用法（value / onChange）"
      >
        <NumberKeyboardUncontrolled />
      </Section>

      <Section
        description="默认避让设备底部安全区；关闭后只保留键盘自身的基础内边距。"
        title="底部安全区（safeAreaInsetBottom）"
      >
        <NumberKeyboardSafeArea />
      </Section>

      <Section
        description="className 覆盖根节点边框，classNames 逐槽调整面板、数字和完成键。"
        title="样式覆盖（className / classNames）"
      >
        <NumberKeyboardStyles />
      </Section>
    </ScrollView>
  );
};

export { NumberKeyboardDemo };
