import type { Ref } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';
import type { SlotClassNames } from '../../types/shared';

/** 选项值 */
type DropdownMenuValue = number | string;

/** 下拉菜单选项 */
interface DropdownMenuOption {
  /** 是否禁用该选项 */
  disabled?: boolean;

  /** 选项显示文本 */
  text: string;

  /** 选项值 */
  value: DropdownMenuValue;
}

/** 下拉菜单项 */
interface DropdownMenuItem {
  /** 是否禁用整列 */
  disabled?: boolean;

  /** 唯一标识，只用于标题列表的 key；不传时回退到下标，items 会动态增删时建议传 */
  key?: string;

  /** 可选值列表 */
  options: DropdownMenuOption[];

  /** 自定义标题，不设置则显示当前选中项文本 */
  title?: string;
}

/** 展开方向 */
type DropdownMenuDirection = 'down' | 'up';

/** DropdownMenu 暴露方法 */
interface DropdownMenuRef {
  /** 关闭当前面板；已经关闭时不做任何事 */
  close: () => void;

  /** 展开指定索引的面板，该项禁用或索引越界时忽略 */
  open: (index: number) => void;
}

/**
 * 插槽名称。
 *
 * `arrow` / `selectedIcon` 作用于矢量图标的 `colorClassName`，只接受 `accent-*` 颜色类。
 * 动画容器（高度包裹层、内容测量层）不开放覆盖——它们承载的是定位与裁剪，改了会直接破坏展开动画。
 */
type DropdownMenuSlots =
  | 'arrow'
  | 'bar'
  | 'content'
  | 'divider'
  | 'option'
  | 'optionText'
  | 'overlay'
  | 'root'
  | 'selectedIcon'
  | 'title'
  | 'titleText';

/** DropdownMenu 组件属性 */
interface DropdownMenuProps {
  /** 自定义根容器 className */
  className?: string;

  /** 各插槽自定义 className */
  classNames?: SlotClassNames<DropdownMenuSlots>;

  /** 选中后是否自动关闭面板，默认 true */
  closeOnSelect?: boolean;

  /** 各项默认选中值；某一项没给时回退到该项的第一个选项 */
  defaultValues?: (DropdownMenuValue | undefined)[];

  /** 展开方向，默认向下 */
  direction?: DropdownMenuDirection;

  /** 展开 / 收起动画时长（毫秒），默认 200 */
  duration?: number;

  /** 点击标题与选项时是否触发轻触反馈，默认 true */
  haptic?: boolean;

  /** 下拉菜单项列表 */
  items: DropdownMenuItem[];

  /** 面板最大高度，超出后面板内部滚动；默认屏幕高度的 80% */
  maxHeight?: number;

  /** 面板展开 / 收起回调，参数为展开项索引，-1 表示已关闭 */
  onOpenChange?: (index: number) => void;

  /** 选中选项回调 */
  onSelect?: (itemIndex: number, option: DropdownMenuOption) => void;

  /** 选中值变化回调 */
  onValuesChange?: (values: (DropdownMenuValue | undefined)[]) => void;

  /** 是否显示遮罩，默认 true */
  overlay?: boolean;

  /** 组件 ref，用于命令式展开 / 收起 */
  ref?: Ref<DropdownMenuRef>;

  /** 是否显示选项之间的分隔线，默认 true */
  showDivider?: boolean;

  /** 各项当前选中值（受控） */
  values?: (DropdownMenuValue | undefined)[];
}

/** 标题栏属性 */
interface DropdownMenuBarProps {
  /** 当前展开的标题索引，-1 表示无 */
  activeIndex: number;

  /** 各插槽自定义 className */
  classNames?: SlotClassNames<DropdownMenuSlots>;

  /** 展开方向 */
  direction: DropdownMenuDirection;

  /** 箭头旋转动画时长（毫秒） */
  duration: number;

  /** 菜单项列表 */
  items: DropdownMenuItem[];

  /** 布局测量回调，面板靠这个高度贴在标题栏边上 */
  onLayout: (e: LayoutChangeEvent) => void;

  /** 标题点击回调 */
  onTitlePress: (index: number) => void;

  /** 各项当前显示文本 */
  titleTexts: string[];
}

/** 下拉面板属性 */
interface DropdownMenuPanelProps {
  /** 标题栏高度，面板据此贴在栏的上沿或下沿 */
  barHeight: number;

  /** 各插槽自定义 className */
  classNames?: SlotClassNames<DropdownMenuSlots>;

  /** 内容高度动画值 */
  contentHeight: SharedValue<number>;

  /** 展开方向 */
  direction: DropdownMenuDirection;

  /** 面板最大高度，超出后内部滚动 */
  maxHeight?: number;

  /** 内容测量回调，实测高度用于驱动展开动画 */
  onContentMeasured: (height: number) => void;

  /** 选项点击回调 */
  onOptionPress: (option: DropdownMenuOption) => void;

  /** 遮罩点击回调 */
  onOverlayPress: () => void;

  /** 当前显示的选项列表 */
  options: DropdownMenuOption[];

  /** 是否显示遮罩 */
  overlay: boolean;

  /** 遮罩透明度动画值 */
  overlayOpacity: SharedValue<number>;

  /** 当前选中值 */
  selectedValue: DropdownMenuValue | undefined;

  /** 是否显示选项之间的分隔线 */
  showDivider: boolean;
}

export type {
  DropdownMenuBarProps,
  DropdownMenuDirection,
  DropdownMenuItem,
  DropdownMenuOption,
  DropdownMenuPanelProps,
  DropdownMenuProps,
  DropdownMenuRef,
  DropdownMenuSlots,
  DropdownMenuValue
};
