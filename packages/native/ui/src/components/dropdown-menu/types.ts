import type { SlotClassNames } from '../../types/shared';

/** 下拉菜单选项 */
interface DropdownMenuOption {
  /** 是否禁用该选项 */
  disabled?: boolean;

  /** 选项显示文本 */
  text: string;

  /** 选项值 */
  value: number | string;
}

/** 下拉菜单项 */
interface DropdownMenuItem {
  /** 是否禁用整列 */
  disabled?: boolean;

  /** 可选值列表 */
  options: DropdownMenuOption[];

  /** 自定义标题，不设置则显示当前选中项文本 */
  title?: string;
}

/** 展开方向 */
type DropdownMenuDirection = 'down' | 'up';

/** 插槽名称 */
type DropdownMenuSlots = 'bar' | 'content' | 'option' | 'optionText' | 'root' | 'selectedIcon' | 'title' | 'titleText';

/** DropdownMenu 组件属性 */
interface DropdownMenuProps {
  /** 自定义根容器 className */
  className?: string;

  /** 各插槽自定义 className */
  classNames?: SlotClassNames<DropdownMenuSlots>;

  /** 选中后是否自动关闭面板 */
  closeOnSelect?: boolean;

  /** 各项默认选中值 */
  defaultValues?: (number | string | undefined)[];

  /** 展开方向 */
  direction?: DropdownMenuDirection;

  /** 动画时长（毫秒） */
  duration?: number;

  /** 下拉菜单项列表 */
  items: DropdownMenuItem[];

  /** 选中选项回调 */
  onSelect?: (itemIndex: number, option: DropdownMenuOption) => void;

  /** 选中值变化回调 */
  onValuesChange?: (values: (number | string | undefined)[]) => void;

  /** 是否显示遮罩 */
  overlay?: boolean;

  /** 是否显示标题间的分隔线 */
  showDivider?: boolean;

  /** 各项当前选中值（受控） */
  values?: (number | string | undefined)[];
}

export type { DropdownMenuDirection, DropdownMenuItem, DropdownMenuOption, DropdownMenuProps, DropdownMenuSlots };
