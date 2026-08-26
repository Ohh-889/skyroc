import { act, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { type UseMediaQueryOptions, useMediaQuery } from '../src/hooks';
import { installMatchMedia } from './helpers/match-media';

interface MediaQueryProbeProps {
  /** Query options passed to the hook under test. */
  options: UseMediaQueryOptions | string;
}

const MediaQueryProbe = (props: MediaQueryProbeProps) => {
  const { options } = props;
  const matches = useMediaQuery(options);

  return <output aria-label="media query result">{String(matches)}</output>;
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('useMediaQuery', () => {
  it('builds min/max width queries and updates when matchMedia changes', () => {
    const controller = installMatchMedia(false);
    const query = '(min-width: 768px) and (max-width: 1024px)';

    render(<MediaQueryProbe options={{ maxWidth: 1024, minWidth: 768 }} />);

    expect(screen.getByLabelText('media query result')).toHaveTextContent('false');
    expect(controller.listenerCount(query)).toBe(1);

    act(() => {
      controller.setMatches(query, true);
    });

    expect(screen.getByLabelText('media query result')).toHaveTextContent('true');
  });

  it('subscribes with string queries and removes listeners on unmount', () => {
    const controller = installMatchMedia(true);
    const query = '(prefers-reduced-motion: reduce)';

    const { unmount } = render(<MediaQueryProbe options={query} />);

    expect(screen.getByLabelText('media query result')).toHaveTextContent('true');
    expect(controller.listenerCount(query)).toBe(1);

    unmount();

    expect(controller.listenerCount(query)).toBe(0);
  });

  it('returns false for empty object queries without subscribing', () => {
    const matchMedia = vi.fn();

    vi.stubGlobal('matchMedia', matchMedia);

    render(<MediaQueryProbe options={{}} />);

    expect(screen.getByLabelText('media query result')).toHaveTextContent('false');
    expect(matchMedia).not.toHaveBeenCalled();
  });

  it('supports legacy MediaQueryList listener APIs', () => {
    const listeners = new Set<(event: MediaQueryListEvent) => void>();
    const query = '(max-width: 640px)';
    const addListener = vi.fn((listener: (event: MediaQueryListEvent) => void) => {
      listeners.add(listener);
    });
    const removeListener = vi.fn((listener: (event: MediaQueryListEvent) => void) => {
      listeners.delete(listener);
    });

    vi.stubGlobal('matchMedia', vi.fn((media: string): MediaQueryList => ({
      addListener,
      dispatchEvent: () => true,
      matches: media === query,
      media,
      onchange: null,
      removeListener
    }) as unknown as MediaQueryList));

    const { unmount } = render(<MediaQueryProbe options={query} />);

    expect(screen.getByLabelText('media query result')).toHaveTextContent('true');
    expect(addListener).toHaveBeenCalledOnce();
    expect(listeners.size).toBe(1);

    unmount();

    expect(removeListener).toHaveBeenCalledOnce();
    expect(listeners.size).toBe(0);
  });
});
