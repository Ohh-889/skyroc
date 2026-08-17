import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, View } from 'react-native';
import { withUniwind } from 'uniwind';
import { RATE_HIT_SLOP } from './rate-variants';
import type { RateIcon } from './types';

/** Ionicons 不认 className，用 withUniwind 把 `accent-*` 工具类映射到 color 上，让星色跟随主题 token */
const StarIcon = withUniwind(Ionicons);

interface RenderIconOptions {
  /** 是否点亮态，决定默认图标取实心还是空心 */
  active: boolean;

  /** 图标取色用的 `accent-*` 类名 */
  colorClassName: string;

  /** 自定义图标，缺省时走内置星星 */
  icon?: RateIcon;

  /** 星索引，透传给函数式图标 */
  index: number;

  /** 图标边长（px） */
  size: number;
}

/**
 * 渲染单层星星图标。
 *
 * 实心星与空心星取自同一字体族，字形轮廓完全对齐，半星遮罩裁剪时两层才不会错位。
 */
function renderIcon(options: RenderIconOptions) {
  const { active, colorClassName, icon, index, size } = options;

  if (typeof icon === 'function') {
    return icon(index, active);
  }

  if (icon) {
    return icon;
  }

  return (
    <StarIcon
      colorClassName={colorClassName}
      name={active ? 'star' : 'star-outline'}
      size={size}
    />
  );
}

interface RateStarProps {
  /** 填充比例，取值 0 到 1，0 为空星、1 为满星、其余为部分填充 */
  fillRatio: number;

  /** 是否允许点左半区选半星，false 时整颗星只有一个命中区 */
  halfSelectable: boolean;

  /** 点亮态图标 */
  icon?: RateIcon;

  /** 已解析的 icon slot 类名 */
  iconClassName: string;

  /** 该星在评分中的下标，从 0 起 */
  index: number;

  /** 是否可交互，false 时不渲染命中区 */
  interactive: boolean;

  /** 已解析的 item slot 类名 */
  itemClassName: string;

  /** 点击回调，参数为该次点击对应的分值 */
  onSelect: (score: number) => void;

  /** 图标边长（px），同时是遮罩与命中区的计算基准 */
  size: number;

  /** 未点亮态图标 */
  voidIcon?: RateIcon;

  /** 已解析的 voidIcon slot 类名 */
  voidIconClassName: string;
}

/** 评分中的单颗星：空心星打底、实心星按比例裁剪覆盖，命中区叠在最上层 */
const RateStar = (props: RateStarProps) => {
  const {
    fillRatio,
    halfSelectable,
    icon,
    iconClassName,
    index,
    interactive,
    itemClassName,
    onSelect,
    size,
    voidIcon,
    voidIconClassName
  } = props;

  const fullScore = index + 1;
  const halfScore = index + 0.5;

  return (
    <View className={itemClassName}>
      {renderIcon({ active: false, colorClassName: voidIconClassName, icon: voidIcon, index, size })}

      {/* 实心星覆盖在空心星之上，用 overflow-hidden 按填充比例裁剪，满星即整幅铺满 */}
      {fillRatio > 0 ? (
        <View
          className="absolute inset-y-0 left-0 overflow-hidden"
          style={{ width: size * fillRatio }}
        >
          {renderIcon({ active: true, colorClassName: iconClassName, icon, index, size })}
        </View>
      ) : null}

      {/* 命中区平铺在最上层：半星模式左右各占一半，不嵌套 Pressable，避免内外层互抢触摸响应 */}
      {interactive ? (
        <>
          {halfSelectable ? (
            <Pressable
              className="absolute inset-y-0 left-0"
              hitSlop={RATE_HIT_SLOP}
              style={{ width: size / 2 }}
              onPress={() => onSelect(halfScore)}
            />
          ) : null}

          <Pressable
            className={halfSelectable ? 'absolute inset-y-0 right-0' : 'absolute inset-0'}
            hitSlop={RATE_HIT_SLOP}
            style={halfSelectable ? { width: size / 2 } : undefined}
            onPress={() => onSelect(fullScore)}
          />
        </>
      ) : null}
    </View>
  );
};

export { RateStar };
