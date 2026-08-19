import { ScrollView } from 'react-native';
import { Section } from '@/src/components/Section';
import { CollapseAccordion } from './CollapseAccordion';
import { CollapseBasic } from './CollapseBasic';
import { CollapseControlled } from './CollapseControlled';
import { CollapseCustomized } from './CollapseCustomized';
import { CollapseLazyRender } from './CollapseLazyRender';
import { CollapseRef } from './CollapseRef';
import { CollapseSize } from './CollapseSize';

/**
 * Collapse 的总览页，逐节复用同目录下的单点 demo。 文档站按节引用同一批文件（<Demo src="@playground/collapse/CollapseBasic" />），
 * 所以这里只负责串场，不要把示例代码写回本文件。
 */
const CollapseDemo = () => {
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-4 pb-20"
      showsVerticalScrollIndicator={false}
    >
      <Section
        description="defaultValue 设置初始展开项，disabled 的面板不可展开。"
        title="基础用法（defaultValue / disabled）"
      >
        <CollapseBasic />
      </Section>

      <Section
        description="accordion 下同时只能展开一个面板，再次点击可全部收起。"
        title="手风琴（accordion）"
      >
        <CollapseAccordion />
      </Section>

      <Section
        description="value 与 onChange 完全接管展开状态。"
        title="受控（value / onChange）"
      >
        <CollapseControlled />
      </Section>

      <Section
        description="Collapse 的 toggleAll 与 CollapseItem 的 toggle 支持命令式控制。"
        title="命令式控制（ref）"
      >
        <CollapseRef />
      </Section>

      <Section
        description="size 提供 sm、md、lg 三档，可逐项设置。"
        title="尺寸（size）"
      >
        <CollapseSize />
      </Section>

      <Section
        description="icon、label、value 扩展标题行，readonly 去掉箭头且不可展开。"
        title="自定义（icon / label / readonly）"
      >
        <CollapseCustomized />
      </Section>

      <Section
        description="默认展开后才渲染内容，lazyRender={false} 可提前渲染。"
        title="懒渲染（lazyRender）"
      >
        <CollapseLazyRender />
      </Section>
    </ScrollView>
  );
};

export { CollapseDemo };
