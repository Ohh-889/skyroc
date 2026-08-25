import { useControllableState } from '@radix-ui/react-use-controllable-state';
import type { ThemeColor, ThemeSize } from '@skyroc/tailwind-plugin/ui';
import { useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import { resolveCheckboxSizes } from './checkbox-variants';
import type { CheckboxSizes } from './checkbox-variants';
import { CheckboxGroupContext } from './CheckboxGroupContext';
import type {
  CheckboxGroupContextValue,
  CheckboxLabelPosition,
  CheckboxShape,
  CheckboxValue,
  CheckedState
} from './types';

export interface UseCheckboxItemOptions {
  /** 组件名，用于受控状态告警与开发期提示定位 */
  caller: string;

  /** 受控选中态，分组时被忽略 */
  checked?: CheckedState;

  /** 选中态自定义图标 */
  checkedIcon?: ReactNode;

  /** 主题色 */
  color?: ThemeColor;

  /** 非受控初始选中态 */
  defaultChecked?: boolean;

  /** 自身禁用态 */
  disabled?: boolean;

  /** 控件尺寸（px） */
  iconSize?: number;

  /** 半选态自定义图标 */
  indeterminateIcon?: ReactNode;

  /** 标签位置 */
  labelPosition?: CheckboxLabelPosition;

  /** 分组内的唯一标识 */
  name?: CheckboxValue;

  /** 选中回调，分组与独立两种模式下行为一致 */
  onCheckedChange?: (checked: boolean) => void;

  /** 指示器形状 */
  shape?: CheckboxShape;

  /** 尺寸预设 */
  size?: ThemeSize;
}

interface ResolvedCheckboxConfig {
  /** 解析后的选中态自定义图标 */
  checkedIcon?: ReactNode;

  /** 解析后的主题色 */
  color: ThemeColor;

  /** 解析后的半选态自定义图标 */
  indeterminateIcon?: ReactNode;

  /** 解析后的标签位置 */
  labelPosition: CheckboxLabelPosition;

  /** 解析后的指示器形状 */
  shape: CheckboxShape;

  /** 解析后的尺寸预设 */
  size: ThemeSize;

  /** 解析后的像素尺寸 */
  sizes: CheckboxSizes;
}

export interface UseCheckboxItemResult extends ResolvedCheckboxConfig {
  /** 当前是否选中，半选时为 false */
  checked: boolean;

  /** 解析后的禁用态 */
  disabled: boolean;

  /** 当前是否半选，分组时恒为 false */
  indeterminate: boolean;

  /** 翻转选中态，禁用或命中组上限时为空操作 */
  toggle: () => void;
}

/**
 * 合并组级配置，优先级统一为「自身 prop > 组配置 > 默认值」。
 *
 * 与选中态逻辑拆开，避免解析分支和状态分支挤在同一个函数里。
 */
function resolveCheckboxConfig(
  options: UseCheckboxItemOptions,
  group?: CheckboxGroupContextValue
): ResolvedCheckboxConfig {
  const size = options.size ?? group?.size ?? 'md';

  return {
    checkedIcon: options.checkedIcon ?? group?.checkedIcon,
    color: options.color ?? group?.color ?? 'primary',
    indeterminateIcon: options.indeterminateIcon ?? group?.indeterminateIcon,
    labelPosition: options.labelPosition ?? group?.labelPosition ?? 'right',
    shape: options.shape ?? group?.shape ?? 'round',
    size,
    sizes: resolveCheckboxSizes(size, options.iconSize ?? group?.iconSize)
  };
}

/** 复选项的公共逻辑：合并组级配置、维护选中态、暴露 toggle，Checkbox 与 CheckboxCard 共用 */
function useCheckboxItem(options: UseCheckboxItemOptions): UseCheckboxItemResult {
  const { caller, checked: checkedProp, defaultChecked = false, disabled = false, name, onCheckedChange } = options;

  const group = useContext(CheckboxGroupContext);

  const hasGroup = group !== undefined;
  const isGrouped = group !== undefined && name !== undefined;

  // 组内缺少 name 会静默退化成不受组控制的独立复选框（仍继承组的 color/disabled），开发期必须显式提示
  useEffect(() => {
    if (!__DEV__) return;
    if (!hasGroup || name !== undefined) return;

    console.warn(`[${caller}] 位于 CheckboxGroup 内但缺少 name，该项不会参与分组选中。`);
  }, [caller, hasGroup, name]);

  // 半选是纯展示态：选中态按未选中处理，点击后进入全选；分组时选中态由组持有，不存在半选
  const indeterminate = isGrouped ? false : checkedProp === 'indeterminate';

  function resolveControlledProp(): boolean | undefined {
    if (isGrouped) return undefined;
    if (checkedProp === 'indeterminate') return false;

    return checkedProp;
  }

  const [selfChecked, setSelfChecked] = useControllableState({
    caller,
    defaultProp: defaultChecked,
    // 分组时选中态由 CheckboxGroup 持有，回调改由 toggle 手动触发，避免这里被跳过导致静默失效
    onChange: isGrouped ? undefined : onCheckedChange,
    prop: resolveControlledProp()
  });

  const checked = isGrouped ? group.isChecked(name) : selfChecked;

  // 组禁用是整组开关，子项无权把自己反选为可用，因此取并集而非覆盖
  const resolvedDisabled = disabled || (group?.disabled ?? false);

  function toggle() {
    if (resolvedDisabled) return;

    const next = !checked;

    if (group !== undefined && name !== undefined) {
      // 命中 max 时 group.toggle 不生效，此时也不能回调，否则外部会收到一个并未发生的变更
      if (!group.toggle(name, next)) return;

      onCheckedChange?.(next);
      return;
    }

    setSelfChecked(next);
  }

  return {
    ...resolveCheckboxConfig(options, group),
    checked,
    disabled: resolvedDisabled,
    indeterminate,
    toggle
  };
}

export { useCheckboxItem };
