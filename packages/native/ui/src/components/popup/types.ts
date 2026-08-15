import type { ReactNode } from 'react';
import type { ModalProps } from 'react-native-modal';

/** 弹出层位置 */
export type PopupPosition = 'bottom' | 'center' | 'left' | 'right' | 'top';

type ModalPropsWithout =
  | 'animationIn'
  | 'animationInTiming'
  | 'animationOut'
  | 'animationOutTiming'
  | 'backdropColor'
  | 'backdropOpacity'
  | 'children'
  | 'isVisible'
  | 'onBackButtonPress'
  | 'onBackdropPress'
  | 'onModalHide'
  | 'onModalShow'
  | 'useNativeDriver';

/** Popup 弹出层属性 */
export interface PopupProps extends Omit<Partial<ModalProps>, ModalPropsWithout> {
  /** 覆盖 position 对应的默认进出场动画，只传一个方向时另一个方向仍走默认值 */
  animation?: {
    in?: ModalProps['animationIn'];
    out?: ModalProps['animationOut'];
  };
  /** 遮罩颜色，默认 '#000' */
  backdropColor?: string;
  /** 遮罩不透明度，默认 0.4 */
  backdropOpacity?: number;
  /** 弹出层内容 */
  children?: ReactNode;
  /** 自定义内容区域样式类名 */
  className?: string;
  /** 是否允许点击遮罩关闭，默认 true */
  closeOnBackdropPress?: boolean;
  /** Android 硬件返回键是否关闭弹出层，默认 true。与遮罩点击独立，避免无遮罩可点时无路可退 */
  closeOnBackPress?: boolean;
  /** 动画时长（毫秒），默认 300 */
  duration?: number;
  /** 关闭动画完成后的回调 */
  onClosed?: () => void;
  /** 打开动画完成后的回调 */
  onOpened?: () => void;
  /** 显示状态变化回调 */
  onUpdateShow?: (show: boolean) => void;
  /** 弹出位置，默认 'center' */
  position?: PopupPosition;
  /** 是否显示圆角，圆角方向由 position 决定 */
  round?: boolean;
  /** 底部是否避让安全区（home indicator）。需外层存在 SafeAreaProvider，否则按 0 处理 */
  safeAreaInsetBottom?: boolean;
  /** 顶部是否避让安全区（状态栏 / 刘海）。需外层存在 SafeAreaProvider，否则按 0 处理 */
  safeAreaInsetTop?: boolean;
  /** 是否显示弹出层 */
  show: boolean;
}
