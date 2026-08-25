import type { ThemeColor, ThemeSize } from '@skyroc/tailwind-plugin/ui';
import type { ReactNode, Ref } from 'react';
import type { View } from 'react-native';
import type { SlotClassNames } from '../../types';

/** Checkbox icon shape */
export type CheckboxShape = 'round' | 'square';

/** Horizontal placement shared by label position and card checkbox position */
export type CheckboxSide = 'left' | 'right';

/** Label position relative to the icon */
export type CheckboxLabelPosition = CheckboxSide;

/** Position of the checkbox control in a card */
export type CheckboxPosition = CheckboxSide;

/**
 * 复选值的取值范围约束。
 *
 * Group 组件对它做泛型化而非直接用作值类型，`useState<string[]>([])` 配 `onChange={setValue}` 才不会因为形参逆变而报错。
 */
export type CheckboxValue = number | string;

/** Layout direction for CheckboxGroup */
export type CheckboxGroupDirection = 'horizontal' | 'vertical';

/** Checked state: boolean or 'indeterminate' */
export type CheckedState = boolean | 'indeterminate';

/**
 * 指示器可覆盖的 slot 名称，Checkbox 与 CheckboxCard 共用。
 *
 * `indicator` 是勾选框本体，`indicatorIcon` 作用于内置勾 / 横线图标的 `colorClassName`，只接受 `accent-*` 颜色类。
 */
export type CheckboxIndicatorSlots = 'indicator' | 'indicatorIcon';

/** Checkbox 组件可覆盖的 slot 名称 */
export type CheckboxSlots = 'control' | 'indicator' | 'indicatorIcon' | 'label' | 'labelWrapper' | 'root';

/** CheckboxCard 组件可覆盖的 slot 名称 */
export type CheckboxCardSlots =
  | 'content'
  | 'description'
  | 'icon'
  | 'indicator'
  | 'indicatorIcon'
  | 'label'
  | 'root'
  | 'texts';

export interface CheckboxProps {
  /** Controlled checked state, ignored when the checkbox belongs to a CheckboxGroup */
  checked?: CheckedState;

  /** Custom icon when checked, replaces the default check inside the control */
  checkedIcon?: ReactNode;

  /** Label content */
  children?: ReactNode;

  /** 覆盖根容器的 className，各 slot 的细粒度覆盖用 classNames */
  className?: string;

  /** 覆盖各 slot 的类名 */
  classNames?: SlotClassNames<CheckboxSlots>;

  /** Theme color preset, falls back to the group value then `primary` */
  color?: ThemeColor;

  /** Initial checked state for uncontrolled usage */
  defaultChecked?: boolean;

  /** Disables this checkbox, a disabled group disables it as well */
  disabled?: boolean;

  /** Control size in pixels, the inner check scales with it */
  iconSize?: number;

  /** Custom icon for indeterminate state, ignored inside a CheckboxGroup */
  indeterminateIcon?: ReactNode;

  /** When true, only the icon toggles the checkbox, label tap is ignored */
  labelDisabled?: boolean;

  /** Position of the label relative to the icon, falls back to the group value then `right` */
  labelPosition?: CheckboxLabelPosition;

  /** Unique identifier, required when used inside CheckboxGroup */
  name?: CheckboxValue;

  /** Callback fired when checked state changes, fires in grouped mode as well */
  onCheckedChange?: (checked: boolean) => void;

  /** 根节点的 ref，用于 measure / 滚动定位等命令式操作 */
  ref?: Ref<View>;

  /** Icon shape, falls back to the group value then `round` */
  shape?: CheckboxShape;

  /** Component size preset, falls back to the group value then `md` */
  size?: ThemeSize;

  /** Test identifier for E2E testing, applied to the root container */
  testID?: string;
}

export interface CheckboxGroupProps<T extends CheckboxValue = CheckboxValue> {
  /** Custom icon when checked, applied to all children */
  checkedIcon?: ReactNode;

  /** Checkbox items */
  children: ReactNode;

  /** NativeWind className for the group container */
  className?: string;

  /** Theme color preset for all children */
  color?: ThemeColor;

  /** Initial checked values for uncontrolled usage */
  defaultValue?: T[];

  /** Layout direction of the checkboxes */
  direction?: CheckboxGroupDirection;

  /** Whether to disable all child checkboxes */
  disabled?: boolean;

  /** Control size in pixels for all child checkboxes */
  iconSize?: number;

  /** Custom icon for indeterminate state, applied to all children */
  indeterminateIcon?: ReactNode;

  /** Label position for all child checkboxes */
  labelPosition?: CheckboxLabelPosition;

  /** Maximum number of checkboxes that can be checked, enforced inside the group */
  max?: number;

  /** Callback fired when the checked values change */
  onChange?: (value: T[]) => void;

  /** 根节点的 ref，用于 measure / 滚动定位等命令式操作 */
  ref?: Ref<View>;

  /** Icon shape for all child checkboxes */
  shape?: CheckboxShape;

  /** Component size preset for all children */
  size?: ThemeSize;

  /** Test identifier for E2E testing, applied to the group container */
  testID?: string;

  /** Controlled array of checked checkbox names */
  value?: T[];
}

export interface CheckboxGroupContextValue {
  /** Custom icon when checked */
  checkedIcon?: ReactNode;

  /** Theme color from group */
  color?: ThemeColor;

  /** Whether the group is disabled */
  disabled?: boolean;

  /** Control size from group */
  iconSize?: number;

  /** Custom icon for indeterminate state */
  indeterminateIcon?: ReactNode;

  /** Check if a name is in the checked list */
  isChecked: (name: CheckboxValue) => boolean;

  /** Whether the max checked limit is reached, `toggle` already enforces it */
  isMaxReached: () => boolean;

  /** Label position from group */
  labelPosition?: CheckboxLabelPosition;

  /** Shape from group */
  shape?: CheckboxShape;

  /** Size from group */
  size?: ThemeSize;

  /** Toggle a checkbox by name, returns whether the change was applied */
  toggle: (name: CheckboxValue, checked: boolean) => boolean;
}

export interface CheckboxCardProps {
  /** Position of the checkbox relative to card content */
  checkboxPosition?: CheckboxPosition;

  /** Controlled checked state, ignored when the card belongs to a CheckboxGroup */
  checked?: CheckedState;

  /** Custom icon when checked, replaces the default check inside the control */
  checkedIcon?: ReactNode;

  /** 覆盖卡片容器的 className，各 slot 的细粒度覆盖用 classNames */
  className?: string;

  /** 覆盖各 slot 的类名 */
  classNames?: SlotClassNames<CheckboxCardSlots>;

  /** Theme color preset, falls back to the group value then `primary` */
  color?: ThemeColor;

  /** Initial checked state for uncontrolled usage */
  defaultChecked?: boolean;

  /** Description text below the label */
  description?: ReactNode;

  /** Disables this card, a disabled group disables it as well */
  disabled?: boolean;

  /** Icon element to display on the card */
  icon?: ReactNode;

  /** Control size in pixels, the inner check scales with it */
  iconSize?: number;

  /** Custom icon for indeterminate state, ignored inside a CheckboxGroup */
  indeterminateIcon?: ReactNode;

  /** Label text or element */
  label?: ReactNode;

  /** Unique identifier, required when used inside CheckboxGroup */
  name?: CheckboxValue;

  /** Callback fired when checked state changes, fires in grouped mode as well */
  onCheckedChange?: (checked: boolean) => void;

  /** 根节点的 ref，用于 measure / 滚动定位等命令式操作；根节点是 Pressable，实例类型同为 View */
  ref?: Ref<View>;

  /** Icon shape, falls back to the group value then `round` */
  shape?: CheckboxShape;

  /** Component size preset, falls back to the group value then `md` */
  size?: ThemeSize;

  /** Test identifier for E2E testing, applied to the card container */
  testID?: string;
}

export interface CheckboxGroupCardItem<T extends CheckboxValue = CheckboxValue> {
  /** Description text */
  description?: ReactNode;

  /** Whether this item is disabled */
  disabled?: boolean;

  /** Icon element */
  icon?: ReactNode;

  /** Label text or element */
  label: ReactNode;

  /** Unique value identifier */
  value: T;
}

export interface CheckboxGroupCardProps<T extends CheckboxValue = CheckboxValue> {
  /** Position of checkbox relative to card content */
  checkboxPosition?: CheckboxPosition;

  /** Custom icon when checked, applied to all cards */
  checkedIcon?: ReactNode;

  /** NativeWind className for the group container */
  className?: string;

  /** Theme color preset */
  color?: ThemeColor;

  /** Initial checked values for uncontrolled usage */
  defaultValue?: T[];

  /** Layout direction */
  direction?: CheckboxGroupDirection;

  /** Disable all items */
  disabled?: boolean;

  /** Control size in pixels */
  iconSize?: number;

  /** Custom icon for indeterminate state, applied to all cards */
  indeterminateIcon?: ReactNode;

  /** 覆盖每张卡片各 slot 的类名，卡片由本组件内部渲染，只能从这里透传 */
  itemClassNames?: SlotClassNames<CheckboxCardSlots>;

  /** Items to render */
  items: CheckboxGroupCardItem<T>[];

  /** Maximum number of cards that can be checked */
  max?: number;

  /** Callback when values change */
  onChange?: (value: T[]) => void;

  /** 根节点的 ref，用于 measure / 滚动定位等命令式操作 */
  ref?: Ref<View>;

  /** Icon shape */
  shape?: CheckboxShape;

  /** Component size preset */
  size?: ThemeSize;

  /** Test identifier for E2E testing, applied to the group container */
  testID?: string;

  /** Controlled selected values */
  value?: T[];
}
