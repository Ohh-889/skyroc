import type { ModalProps } from 'react-native-modal';
import { tv } from 'tailwind-variants';
import type { PopupPosition } from './types';

/** Popup 内容区域样式变体 */
export const popupVariants = tv({
  base: 'bg-background overflow-hidden',
  variants: {
    position: {
      bottom: 'w-full',
      // center 不约束尺寸，由内容自身撑开
      center: '',
      // 抽屉不给宽度就会被内容撑成任意宽，给个默认值，可用 className 覆盖
      left: 'h-full w-3/4',
      right: 'h-full w-3/4',
      top: 'w-full'
    },
    round: {
      true: ''
    }
  },
  // 圆角统一由 round 控制，方向取决于 position：贴边的那一侧不加圆角
  compoundVariants: [
    { position: 'bottom', round: true, className: 'rounded-t-2xl' },
    { position: 'top', round: true, className: 'rounded-b-2xl' },
    { position: 'left', round: true, className: 'rounded-r-2xl' },
    { position: 'right', round: true, className: 'rounded-l-2xl' },
    { position: 'center', round: true, className: 'rounded-2xl' }
  ],
  defaultVariants: {
    position: 'center',
    round: false
  }
});

/** 弹出层动画映射：position → { in, out } */
export const popupAnimationMap: Record<
  PopupPosition,
  { in: ModalProps['animationIn']; out: ModalProps['animationOut'] }
> = {
  bottom: { in: 'slideInUp', out: 'slideOutDown' },
  center: { in: 'fadeIn', out: 'fadeOut' },
  left: { in: 'slideInLeft', out: 'slideOutLeft' },
  right: { in: 'slideInRight', out: 'slideOutRight' },
  top: { in: 'slideInDown', out: 'slideOutUp' }
};
