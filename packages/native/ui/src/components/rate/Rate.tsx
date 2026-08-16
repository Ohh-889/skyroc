import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { cn } from '@skyroc/utils';
import { View } from 'react-native';
import { DEFAULT_RATE_COUNT, DEFAULT_RATE_GUTTER, DEFAULT_RATE_SIZE, rateVariants } from './rate-variants';
import { RateStar } from './RateStar';
import type { RateProps } from './types';

/** 抹掉浮点误差用的量级，任意小数比例按它取整 */
const FRACTION_PRECISION = 10 ** 10;

/** 单颗星的填充精度：整星 / 半星 / 任意小数 */
type FillPrecision = 'exact' | 'half' | 'whole';

/**
 * 解析填充精度。
 *
 * 只有「只读 + 允许半星」才放开任意小数，用于展示 3.7 星这类统计值； 可交互时一律量化到 0.5，保证「点出来的分值」与「看到的星」始终一致。
 */
function resolveFillPrecision(allowHalf: boolean, readonly: boolean): FillPrecision {
  if (!allowHalf) return 'whole';

  return readonly ? 'exact' : 'half';
}

/** 计算第 index 颗星（从 1 起）的填充比例，取值 0 到 1 */
function resolveFillRatio(value: number, index: number, precision: FillPrecision) {
  const ratio = value - index + 1;

  if (ratio >= 1) return 1;

  if (ratio <= 0 || precision === 'whole') return 0;

  if (precision === 'exact') return Math.round(ratio * FRACTION_PRECISION) / FRACTION_PRECISION;

  return ratio >= 0.5 ? 0.5 : 0;
}

const Rate = (props: RateProps) => {
  const {
    allowHalf = false,
    className,
    classNames,
    clearable = false,
    color,
    count = DEFAULT_RATE_COUNT,
    defaultValue = 0,
    disabled = false,
    gutter = DEFAULT_RATE_GUTTER,
    icon,
    onChange,
    readonly = false,
    ref,
    size = DEFAULT_RATE_SIZE,
    value: valueProp,
    voidIcon
  } = props;

  const [value, setValue] = useControllableState({
    caller: 'Rate',
    defaultProp: defaultValue,
    onChange,
    prop: valueProp
  });

  const variantSlots = rateVariants({ color, disabled });

  /** 变体槽与调用方覆盖类合并成最终类名，集中一处，避免 JSX 里散落 cn 调用 */
  function resolveSlotClassNames() {
    return {
      icon: cn(variantSlots.icon(), classNames?.icon),
      item: cn(variantSlots.item(), classNames?.item),
      root: cn(variantSlots.root(), classNames?.root, className),
      voidIcon: cn(variantSlots.voidIcon(), classNames?.voidIcon)
    };
  }

  const slotClassNames = resolveSlotClassNames();

  // 星数取整、分值裁进 [0, count]，越界入参不至于渲染出半截星或多余的空星
  const starCount = Math.max(0, Math.floor(count));
  const currentValue = Math.min(Math.max(value ?? 0, 0), starCount);
  const interactive = !readonly && !disabled;
  const precision = resolveFillPrecision(allowHalf, readonly);

  function handleSelect(score: number) {
    // 再次点中当前分值：可清除时归零，否则维持原值，不重复触发 onChange
    if (score === currentValue) {
      if (clearable) {
        setValue(0);
      }
      return;
    }

    setValue(score);
  }

  return (
    <View
      ref={ref}
      className={slotClassNames.root}
      style={{ gap: gutter }}
    >
      {Array.from({ length: starCount }, (_, index) => (
        <RateStar
          key={index}
          fillRatio={resolveFillRatio(currentValue, index + 1, precision)}
          halfSelectable={allowHalf}
          icon={icon}
          iconClassName={slotClassNames.icon}
          index={index}
          interactive={interactive}
          itemClassName={slotClassNames.item}
          size={size}
          voidIcon={voidIcon}
          voidIconClassName={slotClassNames.voidIcon}
          onSelect={handleSelect}
        />
      ))}
    </View>
  );
};

export { Rate };
