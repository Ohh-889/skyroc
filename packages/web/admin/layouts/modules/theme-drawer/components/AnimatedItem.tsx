import { motion } from 'motion/react';
import type { PropsWithChildren } from 'react';

type Props = PropsWithChildren<{
  /** Extra class name for the animated wrapper. */
  className?: string;
  /** Duration of the animation in seconds */
  duration?: number;
  /** Scale value for animation (0-1) */
  scale?: number;
  /** Whether the content is visible */
  visible: boolean;
}>;

const AnimatedItem = (props: Props) => {
  const { children, className, duration = 0.15, scale = 0.85, visible } = props;

  if (!visible) {
    return null;
  }
  return (
    <motion.div
      layout
      animate={{ opacity: 1, scale: 1 }}
      className={className}
      exit={{ opacity: 0, scale }}
      initial={{ opacity: 0, scale }}
      transition={{ duration, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedItem;
