import { afterEach, describe, expect, it, vi } from 'vitest';
import { Avatar } from '../src/preset/avatar';
import { render, screen, waitFor } from './helpers/render';

const OriginalImage = window.Image;

function installLoadedImageMock() {
  class LoadedImage {
    complete = false;

    naturalWidth = 0;

    onload: (() => void) | null = null;

    onerror: (() => void) | null = null;

    private currentSrc = '';

    private readonly listeners: Record<string, Set<() => void>> = {};

    get src() {
      return this.currentSrc;
    }

    set src(value: string) {
      this.currentSrc = value;
      this.complete = true;
      this.naturalWidth = 1;

      queueMicrotask(() => {
        this.onload?.();
        this.listeners.load?.forEach(listener => {
          listener();
        });
      });
    }

    addEventListener(type: string, listener: () => void) {
      this.listeners[type] ||= new Set();
      this.listeners[type].add(listener);
    }

    removeEventListener(type: string, listener: () => void) {
      this.listeners[type]?.delete(listener);
    }
  }

  vi.stubGlobal('Image', LoadedImage);
}

describe('Avatar', () => {
  afterEach(() => {
    vi.stubGlobal('Image', OriginalImage);
  });

  it('renders fallback content with root and fallback slot props', () => {
    render(
      <Avatar
        classNames={{
          fallback: 'custom-fallback',
          root: 'custom-root'
        }}
        fallback="WS"
        fallbackProps={{ 'aria-label': 'Avatar initials' }}
        rootProps={{ 'aria-label': 'Profile avatar' }}
        size="lg"
      />
    );

    const root = screen.getByLabelText('Profile avatar');
    const fallback = screen.getByLabelText('Avatar initials');

    expect(root).toHaveAttribute('data-slot', 'avatar-root');
    expect(root).toHaveClass('custom-root');
    expect(fallback).toHaveAttribute('data-slot', 'avatar-fallback');
    expect(fallback).toHaveClass('custom-fallback');
    expect(fallback).toHaveTextContent('WS');
  });

  it('renders the image when it has loaded and applies image class names', async () => {
    installLoadedImageMock();

    render(
      <Avatar
        alt="Wang Shipeng"
        className="custom-image"
        classNames={{ image: 'configured-image' }}
        fallback="WS"
        src="/avatar.png"
      />
    );

    const image = await screen.findByRole('img', { name: 'Wang Shipeng' });

    expect(image).toHaveAttribute('data-slot', 'avatar-image');
    expect(image).toHaveAttribute('src', '/avatar.png');
    expect(image).toHaveClass('custom-image');
    expect(image).not.toHaveClass('configured-image');
  });

  it('uses configured image class names when className is not provided', async () => {
    installLoadedImageMock();

    render(
      <Avatar
        alt="Configured avatar"
        classNames={{ image: 'configured-image' }}
        fallback="CA"
        src="/configured-avatar.png"
      />
    );

    await waitFor(() => {
      expect(screen.getByRole('img', { name: 'Configured avatar' })).toHaveClass('configured-image');
    });
  });
});
