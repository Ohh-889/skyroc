import { ScrollView } from 'react-native';
import { Section } from '@/src/components/Section';
import { TextEllipsisBasic } from './TextEllipsisBasic';
import { TextEllipsisContent } from './TextEllipsisContent';
import { TextEllipsisControlled } from './TextEllipsisControlled';
import { TextEllipsisDefaultExpanded } from './TextEllipsisDefaultExpanded';
import { TextEllipsisDots } from './TextEllipsisDots';
import { TextEllipsisEmoji } from './TextEllipsisEmoji';
import { TextEllipsisExpand } from './TextEllipsisExpand';
import { TextEllipsisImperative } from './TextEllipsisImperative';
import { TextEllipsisNoOverflow } from './TextEllipsisNoOverflow';
import { TextEllipsisRows } from './TextEllipsisRows';
import { TextEllipsisStyles } from './TextEllipsisStyles';

/** TextEllipsis 的总览页，逐节复用同目录下的单点 demo，本文件只负责串场。 */
const TextEllipsisDemo = () => {
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-4 pb-20"
      showsVerticalScrollIndicator={false}
    >
      <Section
        description="不传 expandText 时由原生尾部省略号裁剪，rows 控制最多显示行数。"
        title="基础用法（content / rows）"
      >
        <TextEllipsisBasic />
      </Section>

      <Section
        description="expandText 与 collapseText 提供内联的展开、收起入口；省略号不会另起一行。"
        title="展开与收起（expandText / collapseText）"
      >
        <TextEllipsisExpand />
      </Section>

      <Section
        description="defaultExpanded 设置非受控模式的初始展开状态。"
        title="默认展开（defaultExpanded）"
      >
        <TextEllipsisDefaultExpanded />
      </Section>

      <Section
        description="dots 仅在存在 expandText、需要为内联操作文字预留位置时生效。"
        title="自定义省略号（dots）"
      >
        <TextEllipsisDots />
      </Section>

      <Section
        description="短文本与空文本没有溢出时，不显示展开入口，也不额外添加省略号。"
        title="无溢出边界"
      >
        <TextEllipsisNoOverflow />
      </Section>

      <Section
        description="rows 变化后重新测量文本，并回到收起状态。"
        title="动态行数（rows）"
      >
        <TextEllipsisRows />
      </Section>

      <Section
        description="content 变化会重新测量；长文本切换为短文本后，展开入口自动消失。"
        title="动态内容（content）"
      >
        <TextEllipsisContent />
      </Section>

      <Section
        description="expanded 与 onExpandedChange 接管状态，文末操作和外部按钮会同步更新。"
        title="受控模式（expanded / onExpandedChange）"
      >
        <TextEllipsisControlled />
      </Section>

      <Section
        description="ref.toggle(true / false) 指定状态，不传参数时切换当前状态。"
        title="命令式控制（ref.toggle）"
      >
        <TextEllipsisImperative />
      </Section>

      <Section
        description="className 覆盖根容器，classNames 覆盖正文和操作文字；color、size、weight 等 Text 属性继续生效。"
        title="文字与样式（className / classNames）"
      >
        <TextEllipsisStyles />
      </Section>

      <Section
        description="内容按 Unicode 码点裁剪，连续表情不会被截成半个代理字符。"
        title="表情文本边界"
      >
        <TextEllipsisEmoji />
      </Section>
    </ScrollView>
  );
};

export { TextEllipsisDemo };
