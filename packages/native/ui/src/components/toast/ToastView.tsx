import { cn } from '@skyroc/utils';
import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import Animated, { withTiming } from 'react-native-reanimated';
import type { SlotClassNames } from '../../types';
import { Text } from '../text/Typography';
import { toastVariants } from './toast-variants';
import type { ToastSlots, ToastType } from './types';

/** 进场动画时长（毫秒） */
const ENTER_DURATION = 200;

/** 退场动画时长（毫秒） */
const EXIT_DURATION = 150;

/**
 * 进场动画：淡入 + 轻微放大
 *
 * 用 Reanimated 的 layout animation 而不是自己维护 shared value：退场必须发生在节点已经从状态里移除之后， 只有 layout animation 能替我们把 native view
 * 留到动画播完，手写 shared value 的退场永远来不及执行。
 */
const enterAnimation = () => {
  'worklet';

  return {
    animations: {
      opacity: withTiming(1, { duration: ENTER_DURATION }),
      transform: [{ scale: withTiming(1, { duration: ENTER_DURATION }) }]
    },
    initialValues: { opacity: 0, transform: [{ scale: 0.8 }] }
  };
};

/** 退场动画：淡出 + 轻微缩小 */
const exitAnimation = () => {
  'worklet';

  return {
    animations: {
      opacity: withTiming(0, { duration: EXIT_DURATION }),
      transform: [{ scale: withTiming(0.8, { duration: EXIT_DURATION }) }]
    },
    initialValues: { opacity: 1, transform: [{ scale: 1 }] }
  };
};

/** 内置成功图标（勾号，View + border 绘制） */
const SuccessIcon = () => {
  return (
    <View className="size-9 items-center justify-center">
      <View className="h-5 w-3 translate-x-px -translate-y-0.5 rotate-45 border-b-[2.5px] border-r-[2.5px] border-carbon-foreground" />
    </View>
  );
};

/** 内置失败图标（叉号，两条旋转线） */
const FailIcon = () => {
  return (
    <View className="size-9 items-center justify-center">
      <View className="absolute h-[2.5px] w-6 rotate-45 bg-carbon-foreground" />
      <View className="absolute h-[2.5px] w-6 -rotate-45 bg-carbon-foreground" />
    </View>
  );
};

/** Toast 展示层属性 */
interface ToastViewProps {
  /** 覆盖根容器的 className */
  className?: string;

  /** 覆盖各 slot 的类名 */
  classNames?: SlotClassNames<ToastSlots>;

  /** 是否允许点击 Toast 关闭 */
  closeOnClick?: boolean;

  /** 自定义图标内容，覆盖内置图标 */
  icon?: ReactNode;

  /** Toast 消息内容 */
  message?: ReactNode;

  /** 点击 Toast 时触发，仅在 closeOnClick 为 true 时可能被调用 */
  onPressClose?: () => void;

  /** Toast 类型 */
  type?: ToastType;
}

/**
 * Toast 纯展示层
 *
 * 只负责长什么样、进出场怎么动、点一下通知谁，不持有显示状态也不计时；何时出现与何时消失由上层（声明式 Toast 或 toastManager）决定。
 */
const ToastView = (props: ToastViewProps) => {
  const { className, classNames, closeOnClick = false, icon, message, onPressClose, type = 'text' } = props;

  const hasIcon = type !== 'text' || Boolean(icon);

  const variantSlots = toastVariants({ hasIcon });

  /** 变体槽与调用方覆盖类合并成最终类名，集中一处，避免 JSX 里散落 cn 调用 */
  function resolveSlotClassNames() {
    // 优先级：变体样式 < slot 级覆盖（classNames）< 根级覆盖（className）
    return {
      icon: cn(variantSlots.icon(), classNames?.icon),
      // loading 图标本身没有留白，额外补一圈内边距让转圈不贴边；classNames.icon 仍排在补丁之后，覆盖得掉
      loadingIcon: cn(variantSlots.icon(), 'p-1', classNames?.icon),
      loadingIndicator: 'accent-carbon-foreground',
      message: cn(variantSlots.message(), classNames?.message),
      root: cn(variantSlots.root(), classNames?.root, className)
    };
  }

  const slotClassNames = resolveSlotClassNames();

  function renderIcon() {
    if (icon) {
      return <View className={slotClassNames.icon}>{icon}</View>;
    }

    switch (type) {
      case 'success': {
        return (
          <View className={slotClassNames.icon}>
            <SuccessIcon />
          </View>
        );
      }
      case 'fail': {
        return (
          <View className={slotClassNames.icon}>
            <FailIcon />
          </View>
        );
      }
      case 'loading': {
        return (
          <View className={slotClassNames.loadingIcon}>
            <ActivityIndicator
              colorClassName={slotClassNames.loadingIndicator}
              size="large"
            />
          </View>
        );
      }
      default: {
        return null;
      }
    }
  }

  function renderMessage() {
    if (message === null || message === undefined || message === '') return null;

    if (typeof message === 'string' || typeof message === 'number') {
      return <Text className={slotClassNames.message}>{message}</Text>;
    }

    return message;
  }

  function renderBody() {
    return (
      <>
        {renderIcon()}
        {renderMessage()}
      </>
    );
  }

  return (
    <Animated.View
      entering={enterAnimation}
      exiting={exitAnimation}
    >
      {closeOnClick ? (
        <Pressable
          className={slotClassNames.root}
          onPress={onPressClose}
        >
          {renderBody()}
        </Pressable>
      ) : (
        <View className={slotClassNames.root}>{renderBody()}</View>
      )}
    </Animated.View>
  );
};

export { ToastView };
