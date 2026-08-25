import { clsx } from 'clsx';
import type { AnimationPlaybackControls } from 'motion/react';
import { animate, useInView, useMotionValue, useSpring } from 'motion/react';
import type { ComponentPropsWithoutRef } from 'react';
import { useEffect, useRef } from 'react';

interface NumberTickerProps extends ComponentPropsWithoutRef<'span'> {
  /** - 小数位数 */
  decimalPlaces?: number;
  /** - 延时时间 单位：秒 */
  delay?: number;
  /** - 动画方向 */
  direction?: 'down' | 'up';
  /** - 动画时长 单位：秒 如果不指定 则使用spring动画 更为自然地过渡 */
  duration?: number;
  /** - 前缀 */
  prefix?: string;
  /** - 起始值 */
  startValue?: number;
  /** - 后缀 */
  suffix?: string;
  /** - 目标值 */
  value: number;
}

const NumberTicker = ({
  className,
  decimalPlaces = 0,
  delay = 0,
  direction = 'up',
  duration,
  prefix = '',
  startValue = 0,
  suffix = '',
  value,
  ...props
}: NumberTickerProps) => {
  const ref = useRef<HTMLSpanElement>(null);

  const endValue = direction === 'down' ? 0 : value;

  const motionValue = useMotionValue(direction === 'down' ? value : 0);

  const isInView = useInView(ref, { margin: '0px', once: true });

  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100
  });

  function updateTextContent(latest: number) {
    if (!ref.current) return;

    const formattedNumber = Intl.NumberFormat('en-US', {
      maximumFractionDigits: decimalPlaces,
      minimumFractionDigits: decimalPlaces
    }).format(Number(latest.toFixed(decimalPlaces)));
    ref.current.textContent = `${prefix} ${formattedNumber} ${suffix}`;
  }

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    isInView &&
      setTimeout(() => {
        motionValue.set(endValue);
      }, delay * 1000);
  }, [motionValue, isInView, delay, endValue]);

  useEffect(() => {
    let animation: AnimationPlaybackControls;
    if (duration) {
      animation = animate(
        motionValue.get(), // 起始值
        endValue, // 目标值
        {
          duration, // 动画时长（秒）
          onUpdate: latest => {
            // 更新 motionValue（可选：如果后续还有依赖该值的逻辑）
            motionValue.set(latest);

            updateTextContent(latest);
          }
        }
      );
    } else {
      springValue.on('change', latest => {
        updateTextContent(latest);
      });
    }
    return () => animation?.cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [motionValue, springValue, endValue, duration]);

  return (
    <span
      className={clsx('inline-block text-white tracking-wider tabular-nums dark:text-dark', className)}
      ref={ref}
      {...props}
    >
      {prefix} {startValue} {suffix}
    </span>
  );
};

export default NumberTicker;
