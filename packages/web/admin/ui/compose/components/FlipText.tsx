import { clsx } from 'clsx';
import type { Variants } from 'motion/react';
import { AnimatePresence, motion } from 'motion/react';

interface FlipTextProps {
  readonly className?: string;
  readonly delayMultiple?: number;
  readonly duration?: number;
  readonly framerProps?: Variants;
  readonly word: string;
}

const FlipText = ({
  className,
  delayMultiple = 0.08,
  duration = 0.5,
  framerProps = {
    hidden: { opacity: 0, rotateX: -90 },
    visible: { opacity: 1, rotateX: 0 }
  },
  word
}: FlipTextProps) => {
  return (
    <AnimatePresence mode="sync">
      {word.split('').map((char, i) => (
        <motion.span
          animate="visible"
          className={clsx('drop-shadow-sm', className)}
          initial="hidden"
          key={i}
          transition={{ delay: i * delayMultiple, duration }}
          variants={framerProps}
        >
          {char}
        </motion.span>
      ))}
    </AnimatePresence>
  );
};

export default FlipText;
