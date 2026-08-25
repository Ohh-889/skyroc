import { clsx } from 'clsx';
import type { MotionProps } from 'motion/react';
import { motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

interface TypingAnimationProps extends MotionProps {
  as?: React.ElementType;
  children: string;
  className?: string;
  delay?: number;
  duration?: number;
  startOnView?: boolean;
}

export function TypingAnimation({
  as: Component = 'div',
  children,
  className,
  delay = 0,
  duration = 50,
  startOnView = false,
  ...props
}: TypingAnimationProps) {
  const MotionComponent = motion.create(Component, {
    forwardMotionProps: true
  });

  const [displayedText, setDisplayedText] = useState<string>('');
  const [started, setStarted] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!startOnView) {
      const startTimeout = setTimeout(() => {
        setStarted(true);
      }, delay);
      return () => clearTimeout(startTimeout);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setStarted(true);
          }, delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [delay, startOnView]);

  useEffect(() => {
    if (!started) return;

    let i = 0;
    const typingEffect = setInterval(() => {
      if (i < children.length) {
        setDisplayedText(children.substring(0, i + 1));
        i += 1;
      } else {
        clearInterval(typingEffect);
      }
    }, duration);

    // eslint-disable-next-line consistent-return
    return () => {
      clearInterval(typingEffect);
    };
  }, [children, duration, started]);

  return (
    <MotionComponent className={clsx('tracking-[-0.02em]', className)} ref={elementRef} {...props}>
      {displayedText}
    </MotionComponent>
  );
}
