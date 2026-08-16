import type { ThemeColor, ThemeSize } from '@skyroc/ui-types';
import type { ReactNode, Ref } from 'react';
import type { View } from 'react-native';
import type { SlotClassNames } from '../../types';

/** Radio icon shape */
export type RadioShape = 'round' | 'square';

/** Horizontal placement shared by label position and card radio position */
export type RadioSide = 'left' | 'right';

/** Label position relative to the icon */
export type RadioLabelPosition = RadioSide;

/** Position of the radio control in a card */
export type RadioPosition = RadioSide;

/**
 * 单选值的取值范围约束。
 *
 * Group 组件对它做泛型化而非直接用作值类型，`useState('a')` 配 `onChange={setState}` 才不会因为形参逆变而报错。
 */
export type RadioValue = number | string;

/** Layout direction for RadioGroup */
export type RadioGroupDirection = 'horizontal' | 'vertical';

/**
 * 指示器可覆盖的 slot 名称，Radio 与 RadioCard 共用。
 *
 * `indicator` 是外圈控件本体，`dot` 是圆形选中态的内圆点，`indicatorIcon` 作用于方形内置勾图标的 `colorClassName`，只接受 `accent-*` 颜色类。
 */
export type RadioIndicatorSlots = 'dot' | 'indicator' | 'indicatorIcon';

/** Radio 组件可覆盖的 slot 名称 */
export type RadioSlots = 'control' | 'dot' | 'indicator' | 'indicatorIcon' | 'label' | 'labelWrapper' | 'root';

/** RadioCard 组件可覆盖的 slot 名称 */
export type RadioCardSlots =
  | 'content'
  | 'description'
  | 'dot'
  | 'icon'
  | 'indicator'
  | 'indicatorIcon'
  | 'label'
  | 'root'
  | 'texts';

export interface RadioProps {
  /** Controlled checked state, ignored when the radio belongs to a RadioGroup */
  checked?: boolean;

  /** Custom icon when checked, replaces default indicator */
  checkedIcon?: ReactNode;

  /** Label content */
  children?: ReactNode;

  /** 覆盖根容器的 className，各 slot 的细粒度覆盖用 classNames */
  className?: string;

  /** 覆盖各 slot 的类名 */
  classNames?: SlotClassNames<RadioSlots>;

  /** Theme color preset, falls back to the group value then `primary` */
  color?: ThemeColor;

  /** Initial checked state for uncontrolled usage */
  defaultChecked?: boolean;

  /** Disables this radio, a disabled group disables it as well */
  disabled?: boolean;

  /** Outer control size in pixels, the inner dot and check scale with it */
  iconSize?: number;

  /** When true, only the icon toggles the radio, label tap is ignored */
  labelDisabled?: boolean;

  /** Position of the label relative to the icon, falls back to the group value then `right` */
  labelPosition?: RadioLabelPosition;

  /** Unique identifier, required when used inside RadioGroup */
  name?: RadioValue;

  /** Callback fired when this radio becomes checked */
  onCheckedChange?: (checked: boolean) => void;

  /** 根节点的 ref，用于 measure / 滚动定位等命令式操作 */
  ref?: Ref<View>;

  /** Icon shape, falls back to the group value then `round` */
  shape?: RadioShape;

  /** Component size preset, falls back to the group value then `md` */
  size?: ThemeSize;
}

export interface RadioGroupProps<T extends RadioValue = RadioValue> {
  /** Custom icon when checked, applied to all children */
  checkedIcon?: ReactNode;

  /** Radio items */
  children: ReactNode;

  /** NativeWind className for the group container */
  className?: string;

  /** Theme color preset for all children */
  color?: ThemeColor;

  /** Initial value for uncontrolled usage */
  defaultValue?: T;

  /** Layout direction of the radios */
  direction?: RadioGroupDirection;

  /** Whether to disable all child radios */
  disabled?: boolean;

  /** Outer control size in pixels for all child radios */
  iconSize?: number;

  /** Label position for all child radios */
  labelPosition?: RadioLabelPosition;

  /** Callback fired when the selected value changes */
  onChange?: (value: T) => void;

  /** 根节点的 ref，用于 measure / 滚动定位等命令式操作 */
  ref?: Ref<View>;

  /** Icon shape for all child radios */
  shape?: RadioShape;

  /** Component size preset for all children */
  size?: ThemeSize;

  /** Controlled selected radio name */
  value?: T;
}

export interface RadioGroupContextValue {
  /** Custom icon when checked */
  checkedIcon?: ReactNode;

  /** Theme color from group */
  color?: ThemeColor;

  /** Whether the group is disabled */
  disabled?: boolean;

  /** Outer control size from group */
  iconSize?: number;

  /** Check if a name is the selected value */
  isChecked: (name: RadioValue) => boolean;

  /** Label position from group */
  labelPosition?: RadioLabelPosition;

  /** Select a radio by name */
  select: (name: RadioValue) => void;

  /** Shape from group */
  shape?: RadioShape;

  /** Size from group */
  size?: ThemeSize;
}

export interface RadioCardProps {
  /** Controlled checked state, ignored when the card belongs to a RadioGroup */
  checked?: boolean;

  /** Custom icon when checked */
  checkedIcon?: ReactNode;

  /** 覆盖卡片容器的 className，各 slot 的细粒度覆盖用 classNames */
  className?: string;

  /** 覆盖各 slot 的类名 */
  classNames?: SlotClassNames<RadioCardSlots>;

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

  /** Outer control size in pixels, the inner dot and check scale with it */
  iconSize?: number;

  /** Label text or element */
  label?: ReactNode;

  /** Unique identifier, required when used inside RadioGroup */
  name?: RadioValue;

  /** Callback fired when this card becomes checked */
  onCheckedChange?: (checked: boolean) => void;

  /** Position of the radio relative to card content */
  radioPosition?: RadioPosition;

  /** 根节点的 ref，用于 measure / 滚动定位等命令式操作；根节点是 Pressable，实例类型同为 View */
  ref?: Ref<View>;

  /** Icon shape, falls back to the group value then `round` */
  shape?: RadioShape;

  /** Component size preset, falls back to the group value then `md` */
  size?: ThemeSize;
}

export interface RadioGroupCardItem<T extends RadioValue = RadioValue> {
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

export interface RadioGroupCardProps<T extends RadioValue = RadioValue> {
  /** Custom icon when checked, applied to all cards */
  checkedIcon?: ReactNode;

  /** NativeWind className for the group container */
  className?: string;

  /** Theme color preset */
  color?: ThemeColor;

  /** Initial value for uncontrolled usage */
  defaultValue?: T;

  /** Layout direction */
  direction?: RadioGroupDirection;

  /** Disable all items */
  disabled?: boolean;

  /** Outer control size in pixels */
  iconSize?: number;

  /** 覆盖每张卡片各 slot 的类名，卡片由本组件内部渲染，只能从这里透传 */
  itemClassNames?: SlotClassNames<RadioCardSlots>;

  /** Items to render */
  items: RadioGroupCardItem<T>[];

  /** Callback when value changes */
  onChange?: (value: T) => void;

  /** Position of radio relative to card content */
  radioPosition?: RadioPosition;

  /** 根节点的 ref，用于 measure / 滚动定位等命令式操作 */
  ref?: Ref<View>;

  /** Icon shape */
  shape?: RadioShape;

  /** Component size preset */
  size?: ThemeSize;

  /** Controlled selected value */
  value?: T;
}
