import type { ReactNode } from 'react';
import type { SlotClassNames } from '../../types/shared';

/** 单个 tab 项配置 */
interface TabItem {
  /** Tab 面板内容 */
  children?: ReactNode;

  /** 是否禁用该 tab */
  disabled?: boolean;

  /** 唯一标识 */
  key: string;

  /** Tab 标签标题 */
  title: ReactNode;
}

/** Tabs 类型风格 */
type TabsType = 'line' | 'pill';

/** Tabs 插槽名称 */
type TabsSlots = 'content' | 'indicator' | 'pager' | 'root' | 'tab' | 'tabBar' | 'tabBarContent' | 'tabText';

/** 渲染单个面板内容，由懒加载策略决定返回真实内容还是占位 */
type RenderPanel = (index: number, children: ReactNode) => ReactNode;

/** Tabs 组件属性 */
interface TabsProps {
  /** 受控当前激活索引 */
  activeIndex?: number;

  /** NativeWind className */
  className?: string;

  /** 各插槽自定义 className */
  classNames?: SlotClassNames<TabsSlots>;

  /** 非受控默认激活索引 */
  defaultActiveIndex?: number;

  /** Tab 项数据 */
  items: TabItem[];

  /** 是否懒加载面板内容；面板一旦加载即常驻，切走不会卸载 */
  lazy?: boolean;

  /** 开启 lazy 时，预加载当前 tab 前后 N 个面板，默认 0 */
  lazyPreloadDistance?: number;

  /** 激活索引变化回调 */
  onIndexChange?: (index: number) => void;

  /** 开启 lazy 时，未加载面板的占位内容 */
  renderLazyPlaceholder?: () => ReactNode;

  /** 是否开启手势滑动切换；仅原生生效，web 回退实现无手势 */
  swipeable?: boolean;

  /** 类型风格 */
  type?: TabsType;
}

/** TabBar 内部属性 */
interface TabBarProps {
  /** 当前激活索引 */
  activeIndex: number;

  /** 各插槽自定义 className */
  classNames?: SlotClassNames<TabsSlots>;

  /** Tab 项数据 */
  items: TabItem[];

  /** Tab 点击回调 */
  onTabPress: (index: number) => void;

  /** 类型风格 */
  type: TabsType;
}

/** Pager 内部属性 */
interface PagerProps {
  /** 当前激活索引 */
  activeIndex: number;

  /** 各插槽自定义 className */
  classNames?: SlotClassNames<TabsSlots>;

  /** Tab 项数据 */
  items: TabItem[];

  /** 是否懒加载 */
  lazy: boolean;

  /** 预加载当前 tab 前后 N 个面板 */
  lazyPreloadDistance: number;

  /** 手势翻页回调；web 回退实现中为 no-op */
  onPageChange: (index: number) => void;

  /** 未加载面板的占位内容 */
  renderLazyPlaceholder: () => ReactNode;

  /** 是否开启手势滑动；web 回退实现中为 no-op */
  swipeable: boolean;
}

/** PanelStack 内部属性 */
interface PanelStackProps {
  /** 当前激活索引 */
  activeIndex: number;

  /** 各插槽自定义 className */
  classNames?: SlotClassNames<TabsSlots>;

  /** Tab 项数据 */
  items: TabItem[];

  /** 面板内容渲染器 */
  renderPanel: RenderPanel;
}

/** 懒加载面板渲染参数 */
interface LazyPanelsOptions {
  /** 当前激活索引 */
  activeIndex: number;

  /** 是否懒加载 */
  lazy: boolean;

  /** 预加载当前索引前后 N 个面板 */
  lazyPreloadDistance: number;

  /** 未加载面板的占位内容 */
  renderLazyPlaceholder: () => ReactNode;

  /** 面板总数 */
  total: number;
}

export type {
  LazyPanelsOptions,
  PagerProps,
  PanelStackProps,
  RenderPanel,
  TabBarProps,
  TabItem,
  TabsProps,
  TabsSlots,
  TabsType
};
