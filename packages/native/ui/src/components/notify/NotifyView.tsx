import { cn } from '@skyroc/utils';
import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { withTiming } from 'react-native-reanimated';
import type { SlotClassNames } from '../../types';
import { Text } from '../text/Typography';
import { notifyVariants } from './notify-variants';
import type { NotifyPosition, NotifySlots, NotifyType } from './types';

/** 进场动画时长（毫秒） */
const ENTER_DURATION = 200;

/** 退场动画时长（毫秒） */
const EXIT_DURATION = 150;

/** 进出场时的垂直位移距离 */
const OFFSET = 20;

/**
 * 进场动画：淡入 + 从贴边方向滑入
 *
 * 用 Reanimated 的 layout animation 而不是自己维护 shared value：退场必须发生在节点已经从状态里移除之后， 只有 layout animation 能替我们把 native view
 * 留到动画播完，手写 shared value 的退场只会在同一帧里被卸载，永远看不见。
 *
 * Top / bottom 各写一份而不是把方向做成参数：worklet 需要在模块作用域完成序列化，运行时闭包进来的方向变量拿不到。
 */
const enterFromTop = () => {
  'worklet';

  return {
    animations: {
      opacity: withTiming(1, { duration: ENTER_DURATION }),
      transform: [{ translateY: withTiming(0, { duration: ENTER_DURATION }) }]
    },
    initialValues: { opacity: 0, transform: [{ translateY: -OFFSET }] }
  };
};

/** 进场动画：自下方滑入 */
const enterFromBottom = () => {
  'worklet';

  return {
    animations: {
      opacity: withTiming(1, { duration: ENTER_DURATION }),
      transform: [{ translateY: withTiming(0, { duration: ENTER_DURATION }) }]
    },
    initialValues: { opacity: 0, transform: [{ translateY: OFFSET }] }
  };
};

/** 退场动画：淡出 + 向上收回 */
const exitToTop = () => {
  'worklet';

  return {
    animations: {
      opacity: withTiming(0, { duration: EXIT_DURATION }),
      transform: [{ translateY: withTiming(-OFFSET, { duration: EXIT_DURATION }) }]
    },
    initialValues: { opacity: 1, transform: [{ translateY: 0 }] }
  };
};

/** 退场动画：淡出 + 向下收回 */
const exitToBottom = () => {
  'worklet';

  return {
    animations: {
      opacity: withTiming(0, { duration: EXIT_DURATION }),
      transform: [{ translateY: withTiming(OFFSET, { duration: EXIT_DURATION }) }]
    },
    initialValues: { opacity: 1, transform: [{ translateY: 0 }] }
  };
};

/** Notify 展示层属性 */
interface NotifyViewProps {
  /** 自定义背景色，覆盖 type 推导出的背景 */
  background?: string;

  /** 覆盖根容器的 className */
  className?: string;

  /** 覆盖各 slot 的类名 */
  classNames?: SlotClassNames<NotifySlots>;

  /** 自定义文字颜色，覆盖 type 推导出的前景色 */
  color?: string;

  /** 消息内容，字符串会自动包一层 Text，其余节点原样渲染 */
  message?: ReactNode;

  /** 点击 Notify 时触发；不传时渲染成不拦截触摸的普通 View */
  onPress?: () => void;

  /** 贴边方向，决定进出场动画方向与安全区补偿落在哪一侧 */
  position?: NotifyPosition;

  /**
   * 安全区补偿高度（像素）
   *
   * 由挂载方传入而不是自己调 useSafeAreaInsets：补偿必须画在有背景色的根节点里，色块才能一直铺到状态栏； 而是否需要补偿只有知道自己贴在屏幕边缘的挂载方才清楚，声明式内联使用时不该凭空多出一截。
   */
  safeAreaInset?: number;

  /** Notify 类型 */
  type?: NotifyType;
}

/**
 * Notify 纯展示层
 *
 * 只负责长什么样、进出场怎么动、点一下通知谁，不持有显示状态也不计时；何时出现与何时消失由上层（声明式 Notify 或 notifyManager）决定。
 */
const NotifyView = (props: NotifyViewProps) => {
  const {
    background,
    className,
    classNames,
    color,
    message,
    onPress,
    position = 'top',
    safeAreaInset = 0,
    type = 'danger'
  } = props;

  const variantSlots = notifyVariants({ type });

  /** 变体槽与调用方覆盖类合并成最终类名，集中一处，避免 JSX 里散落 cn 调用 */
  function resolveSlotClassNames() {
    // 优先级：变体样式 < slot 级覆盖（classNames）< 根级覆盖（className）
    return {
      content: cn(variantSlots.content(), classNames?.content),
      message: cn(variantSlots.message(), classNames?.message),
      root: cn(variantSlots.root(), classNames?.root, className)
    };
  }

  const slotClassNames = resolveSlotClassNames();

  /** 安全区补偿画在带背景色的根节点上，色块才能一直铺到屏幕边缘 */
  const rootStyle = [
    position === 'top' ? { paddingTop: safeAreaInset } : { paddingBottom: safeAreaInset },
    background ? { backgroundColor: background } : null
  ];

  function renderMessage() {
    if (message === null || message === undefined || message === '') return null;

    if (typeof message === 'string' || typeof message === 'number') {
      return (
        <Text
          className={slotClassNames.message}
          style={color ? { color } : undefined}
        >
          {message}
        </Text>
      );
    }

    return message;
  }

  function renderBody() {
    return <View className={slotClassNames.content}>{renderMessage()}</View>;
  }

  return (
    <Animated.View
      entering={position === 'top' ? enterFromTop : enterFromBottom}
      exiting={position === 'top' ? exitToTop : exitToBottom}
    >
      {onPress ? (
        <Pressable
          className={slotClassNames.root}
          style={rootStyle}
          onPress={onPress}
        >
          {renderBody()}
        </Pressable>
      ) : (
        <View
          className={slotClassNames.root}
          style={rootStyle}
        >
          {renderBody()}
        </View>
      )}
    </Animated.View>
  );
};

export { NotifyView };
