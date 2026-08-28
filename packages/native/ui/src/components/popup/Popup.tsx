import { cn } from '@skyroc/utils';
import type { ViewStyle } from 'react-native';
import { View } from 'react-native';
import Modal from 'react-native-modal';
import { popupAnimationMap, popupVariants } from './popup-variants';
import type { PopupPosition, PopupProps } from './types';

/**
 * 根据弹出位置生成 Modal 容器样式
 *
 * Width 必须显式写死 100%，不能指望父级 stretch：avoidKeyboard 打开时 react-native-modal 会多包一层 KeyboardAvoidingView，而这份样式两层都会用到，其中的
 * alignItems 会让内层容器在交叉轴上收成内容宽度。 容器宽度一旦变成 auto，内容里所有百分比宽度（Dialog 的 w-[85%]、抽屉默认的 w-3/4）就失去了参照， Yoga
 * 会把它们退化成内容宽度，弹层于是缩成窄窄一条。
 */
function getContainerStyle(position: PopupPosition): ViewStyle {
  const base: ViewStyle = { margin: 0, width: '100%' };

  switch (position) {
    case 'bottom': {
      return { ...base, justifyContent: 'flex-end' };
    }
    case 'top': {
      return { ...base, justifyContent: 'flex-start' };
    }
    case 'left': {
      return { ...base, alignItems: 'flex-start' };
    }
    case 'right': {
      return { ...base, alignItems: 'flex-end' };
    }
    case 'center':
    default: {
      return { ...base, justifyContent: 'center', alignItems: 'center' };
    }
  }
}

/** 弹出层组件，封装 react-native-modal */
const Popup = (props: PopupProps) => {
  const {
    animation: exAnimation,
    backdropColor = '#000',
    backdropOpacity = 0.4,
    children,
    className,
    closeOnBackdropPress = true,
    closeOnBackPress = true,
    duration = 300,
    onClosed,
    onOpened,
    onUpdateShow,
    position = 'center',
    round = false,
    safeAreaInsetBottom = false,
    safeAreaInsetTop = false,
    show,
    style,
    surface = true,
    ...rest
  } = props;

  const animation = { ...popupAnimationMap[position], ...exAnimation };

  /** 变体槽与调用方覆盖类合并成最终类名，集中一处，避免 JSX 里散落 cn 调用 */
  function resolveSlotClassNames() {
    return {
      root: cn(popupVariants({ position, round, safeAreaInsetBottom, safeAreaInsetTop, surface }), className)
    };
  }

  const slotClassNames = resolveSlotClassNames();

  function handleBackdropPress() {
    if (closeOnBackdropPress) {
      onUpdateShow?.(false);
    }
  }

  function handleBackPress() {
    if (closeOnBackPress) {
      onUpdateShow?.(false);
    }
  }

  return (
    <Modal
      animationIn={animation.in}
      animationInTiming={duration}
      animationOut={animation.out}
      animationOutTiming={duration}
      backdropColor={backdropColor}
      backdropOpacity={backdropOpacity}
      isVisible={show}
      onBackButtonPress={handleBackPress}
      onBackdropPress={handleBackdropPress}
      onModalHide={onClosed}
      onModalShow={onOpened}
      useNativeDriver
      useNativeDriverForBackdrop
      {...rest}
      style={[getContainerStyle(position), style]}
    >
      <View className={slotClassNames.root}>{children}</View>
    </Modal>
  );
};

export { Popup };
