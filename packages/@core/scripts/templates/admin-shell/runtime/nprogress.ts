import NProgress from 'nprogress';
import type { NProgress as NProgressInstance } from 'nprogress';

export interface SetupNProgressOptions {
  /** Animation easing. */
  easing?: string;

  /** Receives the initialized NProgress instance for host-level config. */
  onReady?: (nprogress: NProgressInstance) => void;

  /** CSS selector for the progress bar container. */
  parent?: string;

  /** Animation speed in milliseconds. */
  speed?: number;
}

export function setupNProgress(options: SetupNProgressOptions = {}) {
  const { easing = 'ease', onReady, parent = '.root', speed = 500 } = options;

  NProgress.configure({ easing, parent, speed });
  onReady?.(NProgress);

  return NProgress;
}
