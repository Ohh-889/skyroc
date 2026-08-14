import { useControllableState } from '@radix-ui/react-use-controllable-state';
import type { ThemeColor, ThemeSize } from '@skyroc/ui-types';
import { useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import { resolveRadioSizes } from './radio-variants';
import type { RadioSizes } from './radio-variants';
import { RadioGroupContext } from './RadioGroupContext';
import type { RadioGroupContextValue, RadioLabelPosition, RadioShape, RadioValue } from './types';

export interface UseRadioItemOptions {
  /** 组件名，用于受控状态告警与开发期提示定位 */
  caller: string;

  /** 受控选中态，分组时被忽略 */
  checked?: boolean;

  /** 选中态自定义图标 */
  checkedIcon?: ReactNode;

  /** 主题色 */
  color?: ThemeColor;

  /** 非受控初始选中态 */
  defaultChecked?: boolean;

  /** 自身禁用态 */
  disabled?: boolean;

  /** 外圈尺寸（px） */
  iconSize?: number;

  /** 标签位置 */
  labelPosition?: RadioLabelPosition;

  /** 分组内的唯一标识 */
  name?: RadioValue;

  /** 选中回调，分组与独立两种模式下行为一致 */
  onCheckedChange?: (checked: boolean) => void;

  /** 指示器形状 */
  shape?: RadioShape;

  /** 尺寸预设 */
  size?: ThemeSize;
}

interface ResolvedRadioConfig {
  /** 解析后的选中态自定义图标 */
  checkedIcon?: ReactNode;

  /** 解析后的主题色 */
  color: ThemeColor;

  /** 解析后的标签位置 */
  labelPosition: RadioLabelPosition;

  /** 解析后的指示器形状 */
  shape: RadioShape;

  /** 解析后的尺寸预设 */
  size: ThemeSize;

  /** 解析后的像素尺寸 */
  sizes: RadioSizes;
}

export interface UseRadioItemResult extends ResolvedRadioConfig {
  /** 当前是否选中 */
  checked: boolean;

  /** 解析后的禁用态 */
  disabled: boolean;

  /** 选中当前项，已选中或禁用时为空操作 */
  select: () => void;
}

/**
 * 合并组级配置，优先级统一为「自身 prop > 组配置 > 默认值」。
 *
 * 与选中态逻辑拆开，避免解析分支和状态分支挤在同一个函数里。
 */
function resolveRadioConfig(options: UseRadioItemOptions, group?: RadioGroupContextValue): ResolvedRadioConfig {
  const size = options.size ?? group?.size ?? 'md';

  return {
    checkedIcon: options.checkedIcon ?? group?.checkedIcon,
    color: options.color ?? group?.color ?? 'primary',
    labelPosition: options.labelPosition ?? group?.labelPosition ?? 'right',
    shape: options.shape ?? group?.shape ?? 'round',
    size,
    sizes: resolveRadioSizes(size, options.iconSize ?? group?.iconSize)
  };
}

/** 单选项的公共逻辑：合并组级配置、维护选中态、暴露 select，Radio 与 RadioCard 共用 */
function useRadioItem(options: UseRadioItemOptions): UseRadioItemResult {
  const { caller, checked: checkedProp, defaultChecked = false, disabled = false, name, onCheckedChange } = options;

  const group = useContext(RadioGroupContext);

  const hasGroup = group !== undefined;
  const isGrouped = group !== undefined && name !== undefined;

  // 组内缺少 name 会静默退化成独立开关（既不互斥也不受组控制），开发期必须显式提示
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return;
    if (!hasGroup || name !== undefined) return;

    console.warn(`[${caller}] 位于 RadioGroup 内但缺少 name，该项不会参与单选互斥。`);
  }, [caller, hasGroup, name]);

  const [selfChecked, setSelfChecked] = useControllableState({
    caller,
    defaultProp: defaultChecked,
    // 分组时选中态由 RadioGroup 持有，回调改由 select 手动触发，避免这里被跳过导致静默失效
    onChange: isGrouped ? undefined : onCheckedChange,
    prop: isGrouped ? undefined : checkedProp
  });

  const checked = isGrouped ? group.isChecked(name) : selfChecked;

  // 组禁用是整组开关，子项无权把自己反选为可用，因此取并集而非覆盖
  const resolvedDisabled = disabled || (group?.disabled ?? false);

  function select() {
    if (resolvedDisabled) return;

    // 单选语义：已选中项再次点击不取消，取消只能由外部改 value / checked
    if (checked) return;

    if (group !== undefined && name !== undefined) {
      group.select(name);
      onCheckedChange?.(true);
      return;
    }

    setSelfChecked(true);
  }

  return {
    ...resolveRadioConfig(options, group),
    checked,
    disabled: resolvedDisabled,
    select
  };
}

export { useRadioItem };
