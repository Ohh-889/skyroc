import { tv } from 'tailwind-variants';

/**
 * FloatingButton 样式。
 *
 * 定位类（`absolute` / `left-0` / `top-0`）写在这里而不是动画样式里：位置完全由 transform 驱动， `left/top` 只负责把坐标原点钉在父容器左上角，是静态值，没必要每帧过一次
 * worklet。
 *
 * 只有一个视觉节点，所以用 `base` 而非 `slots`——外部覆盖走 `className` 就够了。
 */
const floatingButtonVariants = tv({
  base: 'absolute left-0 top-0 items-center justify-center rounded-full bg-primary shadow-lg shadow-black/25'
});

export { floatingButtonVariants };
