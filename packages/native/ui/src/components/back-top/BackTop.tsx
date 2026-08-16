import { useWindowDimensions } from 'react-native';
import Octicons from '@expo/vector-icons/Octicons';
import { scrollTo, useAnimatedReaction, useDerivedValue, useScrollOffset, useSharedValue } from 'react-native-reanimated';
import { withUniwind } from 'uniwind';
import { FloatingButton } from '../floating-button/FloatingButton';
import { backTopVariants } from './back-top-variants';
import type { BackTopProps } from './types';

/** Octicons 不认 className，用 withUniwind 把 `accent-*` 工具类映射到 color 上，让箭头色跟随主题 token */
const ArrowIcon = withUniwind(Octicons);

/** 默认箭头尺寸 */
const ICON_SIZE = 20;

const BackTop = (props: BackTopProps) => {
  const {
    bottom = 128,
    children,
    className,
    immediate = false,
    offset = 200,
    onPress,
    right = 30,
    size = 40,
    target
  } = props;

  const { height: windowHeight, width: windowWidth } = useWindowDimensions();

  const scrollOffset = useScrollOffset(target);

  // 点击计数器：自增后由下面的 useAnimatedReaction 在 UI 线程调 scrollTo，
  // 不用把 scroll 指令绕回 JS 线程
  const scrollTrigger = useSharedValue(0);

  // 可见性全程留在 UI 线程：滚动每一帧都要判定，走 state 会把整棵子树重渲染一遍
  const visible = useDerivedValue(() => scrollOffset.value >= offset);

  const slots = backTopVariants();

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
  // 而闭包依赖（target / immediate）变化会让 worklet 重跑，用「值是否变化」判断才不会凭空滚一次
  useAnimatedReaction(
    () => scrollTrigger.value,
    (current, previous) => {
      if (previous === null || current === previous) return;

      scrollTo(target, 0, 0, !immediate);
    }
  );

  return (
    <FloatingButton
      axis="lock"
      className={className}
      gap={0}
      offset={buttonOffset}
      size={size}
      visible={visible}
      onPress={handlePress}
    >
      {children || (
        <ArrowIcon
          colorClassName={slots.icon()}
          name="chevron-up"
          size={ICON_SIZE}
        />
      )}
    </FloatingButton>
  );
};

export { BackTop };
