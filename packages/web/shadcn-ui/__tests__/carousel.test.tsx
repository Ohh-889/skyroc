import { fireEvent } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Carousel, CarouselContent } from '../src/preset/carousel';
import { render, screen, waitFor } from './helpers/render';

type MockCarouselApi = {
  canScrollNext: ReturnType<typeof vi.fn>;
  canScrollPrev: ReturnType<typeof vi.fn>;
  off: ReturnType<typeof vi.fn>;
  on: ReturnType<typeof vi.fn>;
  scrollNext: ReturnType<typeof vi.fn>;
  scrollPrev: ReturnType<typeof vi.fn>;
};

const carouselMock = vi.hoisted(() => {
  const carouselRef = vi.fn();
  const api = {} as MockCarouselApi;

  api.canScrollNext = vi.fn(() => true);
  api.canScrollPrev = vi.fn(() => true);
  api.scrollNext = vi.fn();
  api.scrollPrev = vi.fn();
  api.on = vi.fn((_event: string, callback: (api: MockCarouselApi | null) => void) => {
    callback(null);
    callback(api);
    return api;
  });
  api.off = vi.fn(() => api);

  const useEmblaCarousel = vi.fn(() => [carouselRef, api]);

  return {
    api,
    carouselRef,
    useEmblaCarousel
  };
});

vi.mock('embla-carousel-react', () => ({
  default: carouselMock.useEmblaCarousel
}));

describe('Carousel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    carouselMock.api.canScrollNext.mockReturnValue(true);
    carouselMock.api.canScrollPrev.mockReturnValue(true);
    carouselMock.useEmblaCarousel.mockReturnValue([carouselMock.carouselRef, carouselMock.api]);
  });

  it('renders slide children and controls carousel navigation with buttons and keyboard', async () => {
    const setApi = vi.fn();
    const { unmount } = render(
      <Carousel
        className="custom-carousel-root"
        classNames={{
          content: 'custom-carousel-content',
          contentWrapper: 'custom-content-wrapper',
          item: 'custom-carousel-item',
          next: 'custom-next',
          previous: 'custom-previous'
        }}
        nextProps={{ children: 'Next slide' }}
        previousProps={{ children: 'Previous slide' }}
        setApi={setApi}
      >
        {[
          <div key="one">Slide one</div>,
          <div key="two">Slide two</div>
        ]}
      </Carousel>
    );

    const region = screen.getByRole('region');

    expect(region).toHaveAttribute('aria-roledescription', 'carousel');
    expect(region).toHaveClass('custom-carousel-root');
    expect(screen.getByText('Slide one').parentElement).toHaveClass('custom-carousel-item');
    expect(screen.getByText('Slide two').parentElement).toHaveClass('custom-carousel-item');
    await waitFor(() => {
      expect(setApi).toHaveBeenCalledWith(carouselMock.api);
    });

    const next = screen.getByRole('button', { name: 'Next slide' });
    const previous = screen.getByRole('button', { name: 'Previous slide' });

    await waitFor(() => {
      expect(next).not.toBeDisabled();
      expect(previous).not.toBeDisabled();
    });

    fireEvent.click(next);
    fireEvent.keyDown(region, { key: 'ArrowRight' });
    fireEvent.click(previous);
    fireEvent.keyDown(region, { key: 'ArrowLeft' });

    expect(carouselMock.api.scrollNext).toHaveBeenCalledTimes(2);
    expect(carouselMock.api.scrollPrev).toHaveBeenCalledTimes(2);

    unmount();

    expect(carouselMock.api.off).toHaveBeenCalledWith('select', expect.any(Function));
  });

  it('supports render-function children and vertical keyboard navigation', async () => {
    render(
      <Carousel
        counts={3}
        nextProps={{ children: 'Move down' }}
        orientation="vertical"
        previousProps={{ children: 'Move up' }}
      >
        {index => <div>Virtual slide {index + 1}</div>}
      </Carousel>
    );

    const region = screen.getByRole('region');

    expect(screen.getByText('Virtual slide 1')).toBeInTheDocument();
    expect(screen.getByText('Virtual slide 3')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Move down' })).not.toBeDisabled();
    });

    fireEvent.keyDown(region, { key: 'ArrowDown' });
    fireEvent.keyDown(region, { key: 'ArrowUp' });

    expect(carouselMock.api.scrollNext).toHaveBeenCalledOnce();
    expect(carouselMock.api.scrollPrev).toHaveBeenCalledOnce();
    expect(carouselMock.useEmblaCarousel).toHaveBeenCalledWith(
      expect.objectContaining({ axis: 'y' }),
      undefined
    );
  });

  it('disables controls when the carousel API is unavailable', () => {
    carouselMock.useEmblaCarousel.mockReturnValue([carouselMock.carouselRef, null as unknown as MockCarouselApi]);

    render(
      <Carousel
        nextProps={{ children: 'Next unavailable' }}
        previousProps={{ children: 'Previous unavailable' }}
      >
        {[<div key="one">Single slide</div>]}
      </Carousel>
    );

    fireEvent.keyDown(screen.getByRole('region'), { key: 'ArrowLeft' });
    fireEvent.keyDown(screen.getByRole('region'), { key: 'ArrowRight' });

    expect(screen.getByRole('button', { name: 'Next unavailable' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Previous unavailable' })).toBeDisabled();
  });

  it('renders default navigation icons and falls back to opts axis for context orientation', async () => {
    render(
      <Carousel
        opts={{ axis: 'y' }}
        orientation={null as never}
      >
        {[<div key="one">Default slide</div>]}
      </Carousel>
    );

    await waitFor(() => {
      expect(screen.getByText('Default slide')).toBeInTheDocument();
    });

    const buttons = Array.from(document.querySelectorAll('button'));

    expect(buttons).toHaveLength(2);
    expect(buttons.every(button => button.querySelector('svg'))).toBe(true);
    expect(carouselMock.useEmblaCarousel).toHaveBeenCalledWith(
      expect.objectContaining({ axis: 'y' }),
      undefined
    );
  });

  it('falls back to horizontal context orientation when opts axis is not vertical', () => {
    render(
      <Carousel
        opts={{ axis: 'x' }}
        orientation={null as never}
      >
        {[<div key="one">Horizontal fallback slide</div>]}
      </Carousel>
    );

    const buttons = Array.from(document.querySelectorAll('button'));

    expect(screen.getByText('Horizontal fallback slide')).toBeInTheDocument();
    expect(buttons).toHaveLength(2);
    expect(buttons.every(button => button.querySelector('svg'))).toBe(true);
  });

  it('ignores unrelated keyboard events', () => {
    render(
      <Carousel
        nextProps={{ children: 'Next ignored' }}
        previousProps={{ children: 'Previous ignored' }}
      >
        {[<div key="one">Ignored key slide</div>]}
      </Carousel>
    );

    fireEvent.keyDown(screen.getByRole('region'), { key: 'Home' });

    expect(carouselMock.api.scrollNext).not.toHaveBeenCalled();
    expect(carouselMock.api.scrollPrev).not.toHaveBeenCalled();
  });

  it('throws when carousel slots are rendered outside the root provider', () => {
    expect(() => render(<CarouselContent />)).toThrow('useCarousel must be used within a <CarouselRoot />');
  });
});
