import { cn } from '@skyroc/utils';
import { useContext } from 'react';
import type { ViewStyle } from 'react-native';
import { View } from 'react-native';
import Modal from 'react-native-modal';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import { popupAnimationMap, popupVariants } from './popup-variants';
import type { PopupPosition, PopupProps } from './types';

/** 根据弹出位置生成 Modal 容器样式 */
function getContainerStyle(position: PopupPosition): ViewStyle {
  const base: ViewStyle = { margin: 0 };

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
    ...rest
  } = props;

  // 直接读 context 而不是 useSafeAreaInsets：后者在缺少 SafeAreaProvider 时会抛错，
  // 而安全区避让只是可选能力，不该让整个弹层挂掉
  const insets = useContext(SafeAreaInsetsContext);

  const animation = { ...popupAnimationMap[position], ...exAnimation };

  const contentStyle: ViewStyle = {
    paddingBottom: safeAreaInsetBottom ? insets?.bottom : undefined,
    paddingTop: safeAreaInsetTop ? insets?.top : undefined
  };

  /** 变体槽与调用方覆盖类合并成最终类名，集中一处，避免 JSX 里散落 cn 调用 */
  function resolveSlotClassNames() {
    return {
      root: cn(popupVariants({ position, round }), className)
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
      <View
        className={slotClassNames.root}
        style={contentStyle}
      >
        {children}
      </View>
    </Modal>
  );
};

export { Popup };
