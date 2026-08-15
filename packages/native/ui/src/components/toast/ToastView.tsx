import { cn } from '@skyroc/utils';
import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import Animated, { withTiming } from 'react-native-reanimated';
import { Text } from '../text/Typography';
import { toastVariants } from './toast-variants';
import type { ToastType } from './types';

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
  const { closeOnClick = false, icon, message, onPressClose, type = 'text' } = props;

  const hasIcon = type !== 'text' || Boolean(icon);
  const { icon: iconCls, message: messageCls, root: rootCls } = toastVariants({ hasIcon });

  function renderIcon() {
    if (icon) {
      return <View className={iconCls()}>{icon}</View>;
    }

    switch (type) {
      case 'success': {
        return (
          <View className={iconCls()}>
            <SuccessIcon />
          </View>
        );
      }
      case 'fail': {
        return (
          <View className={iconCls()}>
            <FailIcon />
          </View>
        );
      }
      case 'loading': {
        return (
          <View className={cn(iconCls(), 'p-1')}>
            <ActivityIndicator
              colorClassName="accent-carbon-foreground"
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
      return <Text className={messageCls()}>{message}</Text>;
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
          className={rootCls()}
          onPress={onPressClose}
        >
          {renderBody()}
        </Pressable>
      ) : (
        <View className={rootCls()}>{renderBody()}</View>
      )}
    </Animated.View>
  );
};

export { ToastView };
