import type { ModalProps } from 'react-native-modal';
import { tv } from 'tailwind-variants';
import type { PopupPosition } from './types';

/** Popup 内容区域样式变体 */
export const popupVariants = tv({
  base: 'overflow-hidden',
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
    },
    /**
     * 容器自身是否作为面板绘制背景
     *
     * 默认 true：多数弹层（抽屉、底部面板）就是那块面板，内容只往里塞文字。 内容自带卡片时必须关掉——容器的不透明底铺满整个矩形，会盖在子节点圆角的外侧，
     * 把子节点辛苦画出来的圆角原样填成直角，而且怎么改子节点的 className 都不会有变化。
     */
    surface: {
      false: 'bg-transparent',
      true: 'bg-background'
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
    round: false,
    surface: true
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
