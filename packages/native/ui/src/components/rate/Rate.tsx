import { useRef } from 'react';
import { Pressable, View } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { cn } from '@skyroc/utils';
import type { RateProps } from './types';

/** 默认配色 */
const DEFAULT_COLOR = '#ffd21e';
const DEFAULT_VOID_COLOR = '#c8c9cc';
const DEFAULT_DISABLED_COLOR = '#c8c9cc';
const DEFAULT_SIZE = 24;
const DEFAULT_GUTTER = 4;

type RateStatus = 'full' | 'half' | 'void';

interface RateItem {
  /** 半星时的小数值 */
  fractional: number;

  /** 当前状态 */
  status: RateStatus;
}

function getRateStatus(
  value: number,
  index: number,
  allowHalf: boolean,
  readonly: boolean
): RateItem {
  if (value >= index) {
    return { fractional: 1, status: 'full' };
  }

  if (value + 0.5 >= index && allowHalf && !readonly) {
    return { fractional: 0.5, status: 'half' };
  }

  // 只读模式下支持任意小数显示（如 3.7 星）
  if (value + 1 >= index && allowHalf && readonly) {
    const cardinal = 10 ** 10;
    return {
      fractional: Math.round((value - index + 1) * cardinal) / cardinal,
      status: 'half'
    };
  }

  return { fractional: 0, status: 'void' };
}

const Rate = (props: RateProps) => {
  const {
    allowHalf = false,
    className,
    clearable = false,
    color = DEFAULT_COLOR,
    count = 5,
    defaultValue = 0,
    disabled = false,
    disabledColor = DEFAULT_DISABLED_COLOR,
    gutter = DEFAULT_GUTTER,
    icon,
    onChange,
    readonly = false,
    size = DEFAULT_SIZE,
    value: valueProp,
    voidColor = DEFAULT_VOID_COLOR,
    voidIcon
  } = props;

  const [value, setValue] = useControllableState({
    caller: 'Rate',
    defaultProp: defaultValue,
    onChange,
    prop: valueProp
  });

  const lastTapRef = useRef<number>(0);

  function isUnselectable(): boolean {
    return readonly || disabled;
  }

  function handleSelect(score: number) {
    if (isUnselectable()) return;
    if (clearable && score === value) {
      setValue(0);
      return;
    }
    if (score !== value) {
      setValue(score);
    }
  }

  function handleStarPress(index: number) {
    if (isUnselectable()) return;

    if (allowHalf) {
      // 双击切换：快速连续点击同一颗星在 .5 和 1 之间切换
      const now = Date.now();
      const score = index + 1;
      const halfScore = index + 0.5;

      if (now - lastTapRef.current < 300 && value === halfScore) {
        handleSelect(score);
      } else if (value === score) {
        handleSelect(clearable ? score : halfScore);
      } else {
        handleSelect(score);
      }

      lastTapRef.current = now;
    } else {
      handleSelect(index + 1);
    }
  }

  function handleHalfPress(index: number) {
    if (isUnselectable()) return;
    handleSelect(index + 0.5);
  }

  function resolveIcon(
    iconProp: RateProps['icon'],
    index: number,
    active: boolean,
    iconColor: string,
    iconSize: number
  ) {
    if (typeof iconProp === 'function') {
      return iconProp(index, active);
    }
    if (iconProp) {
      return iconProp;
    }
    return (
      <AntDesign
        color={iconColor}
        name="star"
        size={iconSize}
      />
    );
  }

  function resolveVoidIcon(
    iconProp: RateProps['voidIcon'],
    index: number,
    active: boolean,
    iconColor: string,
    iconSize: number
  ) {
    if (typeof iconProp === 'function') {
      return iconProp(index, active);
    }
    if (iconProp) {
      return iconProp;
    }
    return (
      <AntDesign
        color={iconColor}
        name="star"
        size={iconSize}
      />
    );
  }

  function renderStar(index: number) {
    const item = getRateStatus(value, index + 1, allowHalf, readonly);
    const isFull = item.status === 'full';
    const isHalf = item.status === 'half';

    const activeColor = disabled ? disabledColor : color;
    const inactiveColor = disabled ? disabledColor : voidColor;
    const starColor = isFull ? activeColor : inactiveColor;
    const isLast = index === count - 1;

    return (
      <View
        key={index}
        style={!isLast ? { marginRight: gutter } : undefined}
      >
        <Pressable
          disabled={isUnselectable()}
          onPress={() => handleStarPress(index)}
          style={{ opacity: disabled ? 0.5 : 1 }}
        >
          {/* 底层：空心图标 */}
          {isHalf ? (
            <View style={{ position: 'relative' }}>
              {resolveVoidIcon(voidIcon, index, false, inactiveColor, size)}

              {/* 半星遮罩：用 overflow hidden 裁剪 */}
              <View
                style={{
                  height: '100%',
                  left: 0,
                  overflow: 'hidden',
                  position: 'absolute',
                  top: 0,
                  width: item.fractional * size
                }}
              >
                {resolveIcon(icon, index, true, activeColor, size)}
              </View>

              {/* 半星左侧点击区域 */}
              {allowHalf && !readonly ? (
                <Pressable
                  onPress={() => handleHalfPress(index)}
                  style={{
                    height: '100%',
                    left: 0,
                    position: 'absolute',
                    top: 0,
                    width: size / 2
                  }}
                />
              ) : null}
            </View>
          ) : (
            <View>
              {isFull
                ? resolveIcon(icon, index, true, starColor, size)
                : resolveVoidIcon(voidIcon, index, false, starColor, size)}

              {/* 半星左侧点击区域 */}
              {allowHalf && !readonly ? (
                <Pressable
                  onPress={() => handleHalfPress(index)}
                  style={{
                    height: '100%',
                    left: 0,
                    position: 'absolute',
                    top: 0,
                    width: size / 2
                  }}
                />
              ) : null}
            </View>
          )}
        </Pressable>
      </View>
    );
  }

  return (
    <View
      className={cn('flex-row items-center', className)}
    >
      {Array.from({ length: count }, (_, i) => renderStar(i))}
    </View>
  );
};

export { Rate };
