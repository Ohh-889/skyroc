import { ScrollView } from 'react-native';
import { Section } from '@/src/components/Section';
import { TreeSelectBadge } from './TreeSelectBadge';
import { TreeSelectBasic } from './TreeSelectBasic';
import { TreeSelectControlled } from './TreeSelectControlled';
import { TreeSelectCustomContent } from './TreeSelectCustomContent';
import { TreeSelectCustomSlots } from './TreeSelectCustomSlots';
import { TreeSelectDisabled } from './TreeSelectDisabled';
import { TreeSelectDynamicItems } from './TreeSelectDynamicItems';
import { TreeSelectMultiple } from './TreeSelectMultiple';

/**
 * TreeSelect 的总览页，逐节复用同目录下的单点 demo。 文档站按节引用同一批文件（<Demo src="@playground/tree-select/TreeSelectBadge" />），
 * 所以这里只负责串场，不要把示例代码写回本文件。
 */
const TreeSelectDemo = () => {
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-4 pb-20"
      showsVerticalScrollIndicator={false}
    >
      <Section
        description="左侧切换分组，右侧单选，选中项打勾并高亮"
        title="Basic"
      >
        <TreeSelectBasic />
      </Section>

      <Section
        description="multiple 开启多选，达到 max 后再点未选中项不会有任何反应，已选中项仍可取消"
        title="Multiple"
      >
        <TreeSelectMultiple />
      </Section>

      <Section
        description="分组支持 badge 与 dot，透传给左侧导航"
        title="Badge"
      >
        <TreeSelectBadge />
      </Section>

      <Section
        description="分组与子项都能单独禁用，禁用项降透明度且不响应点击"
        title="Disabled"
      >
        <TreeSelectDisabled />
      </Section>

      <Section
        description="分组索引与选中值都由外部 state 决定"
        title="Controlled"
      >
        <TreeSelectControlled />
      </Section>

      <Section
        description="renderContent 接收当前分组与下标，右侧内容完全自定义"
        title="Custom Content"
      >
        <TreeSelectCustomContent />
      </Section>

      <Section
        description="先选中靠后的分组再删掉它，激活索引会收敛到最后一组，而不是留下空白右栏"
        title="Dynamic Items"
      >
        <TreeSelectDynamicItems />
      </Section>

      <Section
        description="classNames 覆写自身各插槽，左侧导航内部的插槽走 sidebarClassNames"
        title="Custom Slots"
      >
        <TreeSelectCustomSlots />
      </Section>
    </ScrollView>
  );
};

export { TreeSelectDemo };
