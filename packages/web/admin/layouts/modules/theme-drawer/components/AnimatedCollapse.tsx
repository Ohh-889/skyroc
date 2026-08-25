import type { Easing } from 'motion/react';
import { AnimatePresence, motion } from 'motion/react';
import type { PropsWithChildren } from 'react';

type Props = PropsWithChildren<{
  /** Extra class name for the animated wrapper. */
  className?: string;
  /** Duration of the animation in seconds */
  duration?: number;
  /** Easing function */
  ease?: string | number[];
  /** Whether the content is visible */
  visible: boolean;
}>;

const AnimatedCollapse = (props: Props) => {
  const { children, className, duration = 0.2, ease = 'easeInOut', visible } = props;

  return (
    <AnimatePresence initial={false}>
      {visible && (
        <motion.div
          animate={{ opacity: 1, height: 'auto' }}
          className={className}
          exit={{ opacity: 0, height: 0 }}
          initial={{ opacity: 0, height: 0 }}
          transition={{ duration, ease: ease as Easing }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnimatedCollapse;
