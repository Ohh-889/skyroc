import { LazyMotion } from 'motion/react';
import type { PropsWithChildren } from 'react';

const loadFeatures = () => import('../animate-feature').then(res => res.default);

const LazyAnimate = ({ children }: PropsWithChildren) => {
  return <LazyMotion features={loadFeatures}>{children}</LazyMotion>;
};

export default LazyAnimate;
