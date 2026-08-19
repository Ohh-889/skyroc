import { ScrollView } from 'react-native';
import { Section } from '@/src/components/Section';
import { TreeSelectBadge } from './TreeSelectBadge';
import { TreeSelectBasic } from './TreeSelectBasic';
import { TreeSelectControlled } from './TreeSelectControlled';
import { TreeSelectCustomContent } from './TreeSelectCustomContent';
import { TreeSelectCustomSlots } from './TreeSelectCustomSlots';
import { TreeSelectDisabled } from './TreeSelectDisabled';
import { TreeSelectDynamicItems } from './TreeSelectDynamicItems';
import { TreeSelectEvents } from './TreeSelectEvents';
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
        description="items 提供左侧分组和右侧子项；defaultActiveId 设置非受控初始选中项。"
        title="基础用法（items / defaultActiveId）"
      >
        <TreeSelectBasic />
      </Section>

      <Section
        description="multiple 开启多选；达到 max 后不能新增，但已选中项仍可取消。"
        title="多选与上限（multiple / max）"
      >
        <TreeSelectMultiple />
      </Section>

      <Section
        description="分组的 badge 与 dot 会透传给左侧 Sidebar；defaultMainActiveIndex 设置初始分组。"
        title="分组角标（badge / dot）"
      >
        <TreeSelectBadge />
      </Section>

      <Section
        description="分组与子项可以分别 disabled，禁用项降透明度且不响应点击。"
        title="禁用项（disabled）"
      >
        <TreeSelectDisabled />
      </Section>

      <Section
        description="mainActiveIndex 与 activeId 分别控制当前分组和选中值，变化通过对应回调写回。"
        title="受控模式"
      >
        <TreeSelectControlled />
      </Section>

      <Section
        description="renderContent 接收当前分组与下标，可完全替换右侧默认子项列表。"
        title="自定义右侧内容（renderContent）"
      >
        <TreeSelectCustomContent />
      </Section>

      <Section
        description="onClickNav 返回分组下标；onClickItem 只在选中值确实变化时返回子项。"
        title="点击事件（onClickNav / onClickItem）"
      >
        <TreeSelectEvents />
      </Section>

      <Section
        description="items 变短时激活索引会自动收敛；删到空数组时左右区域保持稳定空态。"
        title="动态数据与空值（items）"
      >
        <TreeSelectDynamicItems />
      </Section>

      <Section
        description="className / classNames 覆盖 TreeSelect，左侧 Sidebar 的内部 slot 通过 sidebarClassNames 透传。"
        title="样式覆盖（className / classNames / sidebarClassNames）"
      >
        <TreeSelectCustomSlots />
      </Section>
    </ScrollView>
  );
};

export { TreeSelectDemo };
