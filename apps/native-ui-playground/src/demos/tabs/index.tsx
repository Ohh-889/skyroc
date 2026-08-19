import { ScrollView } from 'react-native';
import { Section } from '@/src/components/Section';
import { TabsBasic } from './TabsBasic';
import { TabsControlled } from './TabsControlled';
import { TabsCustomSlots } from './TabsCustomSlots';
import { TabsDisabled } from './TabsDisabled';
import { TabsLazy } from './TabsLazy';
import { TabsPill } from './TabsPill';
import { TabsScrollable } from './TabsScrollable';
import { TabsSwipeDisabled } from './TabsSwipeDisabled';

/** Tabs 的总览页，逐节复用同目录下的单点 demo。 文档站按节引用同一批文件（<Demo src="@playground/tabs/TabsPill" />）， 所以这里只负责串场，不要把示例代码写回本文件。 */
const TabsDemo = () => {
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-4 pb-20"
      showsVerticalScrollIndicator={false}
    >
      <Section
        description="items 一次性描述 tab 与面板，默认 line 型指示器"
        title="Basic"
      >
        <TabsBasic />
      </Section>

      <Section
        description="pill 型指示器撑满 tab 高度，作为选中态背景"
        title="Pill"
      >
        <TabsPill />
      </Section>

      <Section
        description="tab 数量超出一屏，tabBar 横向滚动并自动居中激活项"
        title="Scrollable"
      >
        <TabsScrollable />
      </Section>

      <Section
        description="禁用项既不可点击，手势滑过时也会自动回弹"
        title="Disabled"
      >
        <TabsDisabled />
      </Section>

      <Section
        description="activeIndex 与 onIndexChange 把激活项交给外部 state"
        title="Controlled"
      >
        <TabsControlled />
      </Section>

      <Section
        description="只渲染当前及相邻各 1 个面板；已加载的面板常驻，切回来挂载时间不变"
        title="Lazy"
      >
        <TabsLazy />
      </Section>

      <Section
        description="关闭 swipeable 后只能点击 tab 切换"
        title="Swipe Disabled"
      >
        <TabsSwipeDisabled />
      </Section>

      <Section
        description="classNames 覆写 tabBar / tab / tabText / indicator 各插槽"
        title="Custom Slots"
      >
        <TabsCustomSlots />
      </Section>
    </ScrollView>
  );
};

export { TabsDemo };
