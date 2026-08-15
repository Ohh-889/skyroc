import type { ReactNode } from 'react';
import type { SlotClassNames } from '../../types/shared';

/** 单个 tab 项配置 */
interface TabItem {
  /** tab 面板内容 */
  children?: ReactNode;

  /** 是否禁用该 tab */
  disabled?: boolean;

  /** 唯一标识 */
  key: string;

  /** tab 标签标题 */
  title: ReactNode;
}

/** tabs 类型风格 */
type TabsType = 'line' | 'pill';

/** tabs 插槽名称 */
type TabsSlots = 'content' | 'indicator' | 'pager' | 'root' | 'tab' | 'tabBar' | 'tabBarContent' | 'tabText';

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

  /** tab 项数据 */
  items: TabItem[];

  /** 是否懒加载面板内容 */
  lazy?: boolean;

  /** lazy 开启时，预加载当前 tab 前后 N 个面板，默认 0 */
  lazyPreloadDistance?: number;

  /** 激活索引变化回调 */
  onIndexChange?: (index: number) => void;

  /** lazy 开启时，未加载面板的占位内容 */
  renderLazyPlaceholder?: () => ReactNode;

  /** 是否开启手势滑动切换 */
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

  /** tab 项数据 */
  items: TabItem[];

  /** tab 点击回调 */
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

  /** tab 项数据 */
  items: TabItem[];

  /** 是否懒加载 */
  lazy: boolean;

  /** 预加载当前 tab 前后 N 个面板 */
  lazyPreloadDistance: number;

  /** 页面切换回调 */
  onPageChange: (index: number) => void;

  /** 未加载面板的占位内容 */
  renderLazyPlaceholder: () => ReactNode;

  /** 是否开启手势滑动 */
  swipeable: boolean;
}

export type { PagerProps, TabBarProps, TabItem, TabsProps, TabsSlots, TabsType };
