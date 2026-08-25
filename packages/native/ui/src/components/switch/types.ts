import type { ThemeColor, ThemeSize } from '@skyroc/tailwind-plugin/ui';
import type { ReactNode, Ref } from 'react';
import type { View } from 'react-native';
import type { SlotClassNames } from '../../types';

/**
 * Switch 组件可覆盖的 slot 名称。
 *
 * `root` 是轨道本体（同时承载未选中底色），`checkedOverlay` 是叠在上面的选中色层，
 * `indicator` 作用于 loading 指示器的 `colorClassName`，只接受 `accent-*` 颜色类。
 */
export type SwitchSlots = 'checkedOverlay' | 'indicator' | 'root' | 'thumb';

export interface SwitchProps {
  /** Controlled checked state */
  checked?: boolean;

  /** Custom content inside the thumb (e.g. icon), hidden while loading */
  children?: ReactNode;

  /** 覆盖轨道容器的 className，各 slot 的细粒度覆盖用 classNames */
  className?: string;

  /** 覆盖各 slot 的类名 */
  classNames?: SlotClassNames<SwitchSlots>;

  /** Theme color preset for the checked state */
  color?: ThemeColor;

  /** Initial checked state for uncontrolled usage */
  defaultChecked?: boolean;

  /** Whether the switch is disabled */
  disabled?: boolean;

  /** Whether the switch is in loading state, blocks interaction as well */
  loading?: boolean;

  /** Callback fired when checked state changes */
  onCheckedChange?: (checked: boolean) => void;

  /** 根节点的 ref，用于 measure / 滚动定位等命令式操作；根节点是 Pressable，实例类型同为 View */
  ref?: Ref<View>;

  /** Component size preset */
  size?: ThemeSize;

  /** Test identifier for E2E testing, applied to the track container */
  testID?: string;
}
