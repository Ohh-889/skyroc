import { ScrollView } from 'react-native';
import { Section } from '@/src/components/Section';
import { SwipeCellBasic } from './SwipeCellBasic';
import { SwipeCellBeforeClose } from './SwipeCellBeforeClose';
import { SwipeCellDisabled } from './SwipeCellDisabled';
import { SwipeCellEvents } from './SwipeCellEvents';
import { SwipeCellExclusive } from './SwipeCellExclusive';
import { SwipeCellImperative } from './SwipeCellImperative';
import { SwipeCellStyles } from './SwipeCellStyles';
import { SwipeCellWidth } from './SwipeCellWidth';

/**
 * SwipeCell 的总览页，逐节复用同目录下的单点 demo。 文档站按节引用同一批文件（<Demo src="@playground/swipe-cell/SwipeCellBeforeClose" />），
 * 所以这里只负责串场，不要把示例代码写回本文件。
 */
const SwipeCellDemo = () => {
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-4 pb-20"
      showsVerticalScrollIndicator={false}
    >
      <Section
        description="leading 与 trailing 分别提供左右操作区，宽度默认从内容自动测量。"
        title="基础用法（leading / trailing）"
      >
        <SwipeCellBasic />
      </Section>

      <Section
        description="beforeClose 可同步或异步决定是否收起，点击主体、滑动收起和实例 close 都会经过拦截。"
        title="关闭拦截（beforeClose）"
      >
        <SwipeCellBeforeClose />
      </Section>

      <Section
        description="leadingWidth / trailingWidth 可跳过自动测量并指定两侧停靠距离。"
        title="操作区宽度"
      >
        <SwipeCellWidth />
      </Section>

      <Section
        description="默认只允许一个实例展开；exclusive=false 时多个单元格可同时保持展开。"
        title="互斥展开（exclusive）"
      >
        <SwipeCellExclusive />
      </Section>

      <Section
        description="ref 暴露 open(left)、open(right) 与 close。"
        title="命令式控制（ref）"
      >
        <SwipeCellImperative />
      </Section>

      <Section
        description="name 会随 onOpen / onClose 返回，position 表示展开侧或关闭来源。"
        title="事件监听（name / onOpen / onClose）"
      >
        <SwipeCellEvents />
      </Section>

      <Section
        description="disabled 会禁止滑动，并立即收起已经展开的操作区。"
        title="禁用（disabled）"
      >
        <SwipeCellDisabled />
      </Section>

      <Section
        description="className 覆盖根容器，classNames 可调整 content、两侧操作区与展开遮罩。"
        title="样式覆盖（className / classNames）"
      >
        <SwipeCellStyles />
      </Section>
    </ScrollView>
  );
};

export { SwipeCellDemo };
