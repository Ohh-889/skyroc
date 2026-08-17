import type { ReactNode } from 'react';
import type { ViewProps } from 'react-native';
import type { SlotClassNames } from '../../types';
import type { SidebarSlots } from '../sidebar';

/** 子项唯一标识 */
type TreeSelectChildId = number | string;

/** 子项数据 */
interface TreeSelectChild {
  /** 是否禁用 */
  disabled?: boolean;

  /** 唯一标识 */
  id: TreeSelectChildId;

  /** 显示文本 */
  text: string;
}

/** 分组数据 */
interface TreeSelectItem {
  /** 徽标内容 */
  badge?: ReactNode;

  /** 子项列表 */
  children?: TreeSelectChild[];

  /** 是否禁用 */
  disabled?: boolean;

  /** 是否显示小红点 */
  dot?: boolean;

  /** 唯一标识，默认取分组在 items 中的下标；分组会动态增删或重排时必须显式传值，否则下标会串位 */
  id?: TreeSelectChildId;

  /** 显示文本 */
  text: string;
}

/**
 * 选中值：多选模式下是子项 id 数组，否则是单个子项 id（`null` 表示未选中）。
 *
 * 用 `null` 而不是 `undefined` 表示空值，否则受控模式下会被判定成非受控。
 */
type TreeSelectActiveId = TreeSelectChildId | TreeSelectChildId[] | null;

/**
 * 插槽名称。
 *
 * `selectedIcon` 作用于选中图标的 `colorClassName`，只接受 `accent-*` 颜色类； `sidebar` 只覆盖左侧导航的根节点（默认 `w-24`，调宽窄从这里改），其内部各 slot 走
 * `sidebarClassNames`。
 */
type TreeSelectSlots = 'content' | 'contentItem' | 'contentItemText' | 'root' | 'selectedIcon' | 'sidebar';

/** TreeSelect 组件属性 */
interface TreeSelectProps extends Omit<ViewProps, 'children'> {
  /** 受控选中值，多选模式传数组，单选模式传单个 id */
  activeId?: TreeSelectActiveId;

  /** 覆盖根容器的 className，各 slot 的细粒度覆盖用 classNames */
  className?: string;

  /** 各插槽自定义 className */
  classNames?: SlotClassNames<TreeSelectSlots>;

  /** 默认选中值（非受控），不传时单选为未选中、多选为空数组 */
  defaultActiveId?: TreeSelectActiveId;

  /** 默认激活的左侧导航索引 */
  defaultMainActiveIndex?: number;

  /** 组件高度 */
  height?: number;

  /** 分组数据 */
  items?: TreeSelectItem[];

  /** 受控的左侧导航索引；索引是位置而非身份，items 增删或重排后需要调用方自行校正 */
  mainActiveIndex?: number;

  /** 多选时最大可选数量，达到上限后点击未选中项不产生任何效果，也不会触发 onClickItem */
  max?: number;

  /** 是否多选 */
  multiple?: boolean;

  /** 选中值变化回调 */
  onActiveIdChange?: (activeId: TreeSelectActiveId) => void;

  /** 点击子项回调，仅在选中值确实变化时触发 */
  onClickItem?: (item: TreeSelectChild) => void;

  /** 点击左侧导航回调 */
  onClickNav?: (index: number) => void;

  /** 左侧导航激活索引变化回调 */
  onMainActiveIndexChange?: (index: number) => void;

  /** 自定义右侧内容，接收当前分组及其下标；items 为空时不会调用 */
  renderContent?: (item: TreeSelectItem, index: number) => ReactNode;

  /** 左侧导航各 slot 的类名，左栏由内部的 Sidebar 渲染，只能从这里透传 */
  sidebarClassNames?: SlotClassNames<SidebarSlots>;
}

export type {
  TreeSelectActiveId,
  TreeSelectChild,
  TreeSelectChildId,
  TreeSelectItem,
  TreeSelectProps,
  TreeSelectSlots
};
