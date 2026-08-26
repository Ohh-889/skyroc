'use client';

import { useSyncExternalStore } from 'react';

export interface UseMediaQueryOptions {
  /** Maximum width in pixels (inclusive). */
  maxWidth?: number;
  /** Minimum width in pixels (inclusive). */
  minWidth?: number;
}

function buildQuery({ maxWidth, minWidth }: UseMediaQueryOptions): string {
  const parts: string[] = [];

  if (typeof minWidth === 'number') {
    parts.push(`(min-width: ${minWidth}px)`);
  }

  if (typeof maxWidth === 'number') {
    parts.push(`(max-width: ${maxWidth}px)`);
  }

  return parts.join(' and ');
}

const noop = () => () => {};

const getServerSnapshot = () => false;

export function useMediaQuery(options: UseMediaQueryOptions | string): boolean {
  const query = typeof options === 'string' ? options : buildQuery(options);

  const subscribe = (onChange: () => void) => {
    if (typeof window === 'undefined' || !query) {
      return noop();
    }

    const mediaQueryList = window.matchMedia(query);

    if (typeof mediaQueryList.addEventListener === 'function') {
      mediaQueryList.addEventListener('change', onChange);
      return () => mediaQueryList.removeEventListener('change', onChange);
    }

    mediaQueryList.addListener(onChange);
    return () => mediaQueryList.removeListener(onChange);
  };

  const getSnapshot = () => {
    if (typeof window === 'undefined' || !query) {
      return false;
    }

    return window.matchMedia(query).matches;
  };

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export default useMediaQuery;
