import { ScrollView } from 'react-native';
import { Section } from '@/src/components/Section';
import { SidebarBadge } from './SidebarBadge';
import { SidebarBasic } from './SidebarBasic';
import { SidebarControlled } from './SidebarControlled';
import { SidebarCustomSlots } from './SidebarCustomSlots';
import { SidebarCustomTitle } from './SidebarCustomTitle';
import { SidebarDisabled } from './SidebarDisabled';
import { SidebarNotScrollable } from './SidebarNotScrollable';
import { SidebarScrollable } from './SidebarScrollable';
import { SidebarUnevenItems } from './SidebarUnevenItems';

/** Sidebar 的总览页，逐节复用同目录下的单点 demo。 文档站按节引用同一批文件（<Demo src="@playground/sidebar/SidebarBadge" />）， 所以这里只负责串场，不要把示例代码写回本文件。 */
const SidebarDemo = () => {
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-4 pb-20"
      showsVerticalScrollIndicator={false}
    >
      <Section
        description="items 声明分类，onIndexChange 抛出当前下标。"
        title="基础用法（items）"
      >
        <SidebarBasic />
      </Section>

      <Section
        description="标题换行导致各项高度不一，指示器仍然逐项对齐——每项自己上报布局，不按首项高度推算。"
        title="不等高列表"
      >
        <SidebarUnevenItems />
      </Section>

      <Section
        description="badge 传数字、dot 传小红点，角标贴着标题而不是飞到整项右边缘。"
        title="角标（badge / dot）"
      >
        <SidebarBadge />
      </Section>

      <Section
        description="title 接受 ReactNode，可组合主副文案等自定义内容；字符串标题会自动补充无障碍标签。"
        title="自定义标题（title）"
      >
        <SidebarCustomTitle />
      </Section>

      <Section
        description="disabled 让该项整体降透明度且不响应点击。"
        title="禁用项（disabled）"
      >
        <SidebarDisabled />
      </Section>

      <Section
        description="onIndexChange 第二个参数直接给出该项配置，可以按 key 持久化选中态而不是存下标。"
        title="受控（activeIndex / onIndexChange）"
      >
        <SidebarControlled />
      </Section>

      <Section
        description="项数超出容器高度时侧边栏自身可纵向滚动，指示器跟着内容一起滚。"
        title="可滚动（scrollable）"
      >
        <SidebarScrollable />
      </Section>

      <Section
        description="scrollable={false} 时根节点退化成普通 View，交给外层容器滚动，避免嵌套滚动。"
        title="不滚动（scrollable）"
      >
        <SidebarNotScrollable />
      </Section>

      <Section
        description="className 覆盖根节点，classNames 可细分 root、content、indicator、item 与 itemText。"
        title="样式覆盖（className / classNames）"
      >
        <SidebarCustomSlots />
      </Section>
    </ScrollView>
  );
};

export { SidebarDemo };
