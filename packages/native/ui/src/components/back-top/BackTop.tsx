import Octicons from '@expo/vector-icons/Octicons';
import { useWindowDimensions } from 'react-native';
import {
  scrollTo,
  useAnimatedReaction,
  useDerivedValue,
  useScrollOffset,
  useSharedValue
} from 'react-native-reanimated';
import { withUniwind } from 'uniwind';
import { FloatingButton } from '../floating-button/FloatingButton';
import { backTopVariants } from './back-top-variants';
import type { BackTopProps, BackTopScrollable } from './types';

/** Octicons 不认 className，用 withUniwind 把 `accent-*` 工具类映射到 color 上，让箭头色跟随主题 token */
const ArrowIcon = withUniwind(Octicons);

/** 默认箭头尺寸 */
const ICON_SIZE = 20;

/** 默认按钮直径，比 FloatingButton 的通用尺寸小一号——回顶是次要动作，不该抢主 FAB 的视觉权重 */
const DEFAULT_SIZE = 40;

/** 默认距屏幕右边的距离 */
const DEFAULT_RIGHT = 30;

/** 默认距屏幕底边的距离，预留出常驻 TabBar 的高度 */
const DEFAULT_BOTTOM = 128;

/** 默认显示阈值：滚过大约一屏才出现，短列表不会刚一动就弹出按钮 */
const DEFAULT_OFFSET = 200;

const BackTop = <TRef extends BackTopScrollable>(props: BackTopProps<TRef>) => {
  const {
    bottom = DEFAULT_BOTTOM,
    children,
    className,
    disabled = false,
    immediate = false,
    offset = DEFAULT_OFFSET,
    onPress,
    right = DEFAULT_RIGHT,
    size = DEFAULT_SIZE,
    style,
    target
  } = props;

  const { height: windowHeight, width: windowWidth } = useWindowDimensions();

  const scrollOffset = useScrollOffset(target);

  // 点击计数器：自增后由下面的 useAnimatedReaction 在 UI 线程调 scrollTo，
  // 不用把 scroll 指令绕回 JS 线程
  const scrollTrigger = useSharedValue(0);

  // 可见性全程留在 UI 线程：滚动每一帧都要判定，走 state 会把整棵子树重渲染一遍
  const visible = useDerivedValue(() => scrollOffset.value >= offset, [offset, scrollOffset]);

  const variantSlots = backTopVariants();

  // right / bottom 就是本组件对外承诺的边距，所以 gap 传 0——留着 FloatingButton 的默认 gap 会在
  // right < 24 时把位置静默改掉。axis 是 lock，本来也不需要拖拽边界
  const buttonOffset = {
    x: windowWidth - size - right,
    y: windowHeight - size - bottom
  };

  function handlePress() {
    onPress?.();
    scrollTrigger.value += 1;
  }

  // 必须用 useAnimatedReaction 而不是 useDerivedValue 做副作用：计数器一旦大于 0 就永远大于 0，
  // 而闭包依赖（target / immediate）变化会让 mapper 重启并立刻跑一次，
  // 只有比对前后值才不会在改 prop 时凭空滚一次
  useAnimatedReaction(
    () => scrollTrigger.value,
    (current, previous) => {
      if (previous === null || current === previous) return;

      scrollTo(target, 0, 0, !immediate);
    },
    [immediate, scrollTrigger, target]
  );

  return (
    <FloatingButton
      axis="lock"
      className={className}
      disabled={disabled}
      gap={0}
      offset={buttonOffset}
      size={size}
      style={style}
      visible={visible}
      onPress={handlePress}
    >
      {children || (
        <ArrowIcon
          colorClassName={variantSlots.icon()}
          name="chevron-up"
          size={ICON_SIZE}
        />
      )}
    </FloatingButton>
  );
};

export { BackTop };
