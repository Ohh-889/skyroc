import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ConfigProvider } from '../src/preset/config-provider';
import { Slider } from '../src/preset/slider';
import { render, screen, setupUser } from './helpers/render';

describe('Slider', () => {
  it('renders range sliders with slot class names, data attributes and forwarded refs', () => {
    const ref = createRef<HTMLSpanElement>();

    render(
      <Slider
        ref={ref}
        className="custom-slider-root"
        classNames={{
          range: 'custom-slider-range',
          root: 'configured-slider-root',
          thumb: 'custom-slider-thumb',
          track: 'custom-slider-track'
        }}
        color="success"
        defaultValue={[20, 80]}
        max={100}
        min={0}
        rangeProps={{ 'aria-label': 'Selected range' }}
        size="xl"
        step={5}
        thumbProps={{ 'aria-label': 'Price range' }}
        trackProps={{ 'aria-label': 'Price track' }}
      />
    );

    const root = ref.current;
    const thumbs = screen.getAllByRole('slider', { name: 'Price range' });
    const track = document.querySelector('[data-slot="slider-track"]');
    const range = document.querySelector('[data-slot="slider-range"]');

    expect(root).toHaveAttribute('data-slot', 'slider-root');
    expect(root).toHaveClass('custom-slider-root');
    expect(root).not.toHaveClass('configured-slider-root');
    expect(track).toHaveAttribute('data-color', 'success');
    expect(track).toHaveClass('custom-slider-track', 'h-3', 'bg-success/20');
    expect(range).toHaveAttribute('data-color', 'success');
    expect(range).toHaveClass('custom-slider-range', 'bg-success');
    expect(thumbs).toHaveLength(2);
    expect(thumbs[0]).toHaveAttribute('aria-valuenow', '20');
    expect(thumbs[1]).toHaveAttribute('aria-valuenow', '80');
    expect(thumbs[0]).toHaveClass('custom-slider-thumb', 'size-6', 'border-success');
  });

  it('updates values through keyboard interaction', async () => {
    const user = setupUser();
    const onValueChange = vi.fn();

    render(
      <Slider
        aria-label="Volume"
        defaultValue={[50]}
        max={100}
        min={0}
        step={10}
        thumbProps={{ 'aria-label': 'Volume' }}
        onValueChange={onValueChange}
      />
    );

    const thumb = screen.getByRole('slider', { name: 'Volume' });

    thumb.focus();
    await user.keyboard('{ArrowRight}');

    expect(onValueChange).toHaveBeenLastCalledWith([60]);
    expect(thumb).toHaveAttribute('aria-valuenow', '60');
  });

  it('renders controlled values and handles sliders without initial values', () => {
    const onValueChange = vi.fn();

    render(
      <Slider
        aria-label="Controlled slider"
        thumbProps={{ 'aria-label': 'Controlled value' }}
        value={[40]}
        onValueChange={onValueChange}
      />
    );

    const controlledThumb = screen.getByRole('slider', { name: 'Controlled value' });

    expect(controlledThumb).toHaveAttribute('aria-valuenow', '40');

    const { container } = render(<Slider aria-label="Empty slider" />);

    expect(container.querySelector('[data-slot="slider-root"]')).toBeInTheDocument();
    expect(container.querySelectorAll('[data-slot="slider-thumb"]')).toHaveLength(0);
  });

  it('uses ConfigProvider slider defaults and lets component props override them', () => {
    render(
      <ConfigProvider
        slider={{
          className: 'configured-slider-root',
          classNames: {
            thumb: 'configured-slider-thumb',
            track: 'configured-slider-track'
          },
          color: 'warning',
          size: 'lg'
        }}
      >
        <Slider
          aria-label="Configured slider"
          defaultValue={[25]}
          thumbProps={{ 'aria-label': 'Configured slider thumb' }}
        />
        <Slider
          aria-label="Overridden slider"
          className="override-slider-root"
          color="destructive"
          defaultValue={[75]}
          size="xs"
          thumbProps={{ 'aria-label': 'Overridden slider thumb' }}
        />
      </ConfigProvider>
    );

    const configuredThumb = screen.getByRole('slider', { name: 'Configured slider thumb' });
    const overriddenThumb = screen.getByRole('slider', { name: 'Overridden slider thumb' });
    const configuredRoot = configuredThumb.closest('[data-slot="slider-root"]');
    const overriddenRoot = overriddenThumb.closest('[data-slot="slider-root"]');

    expect(configuredRoot).toHaveClass('configured-slider-root');
    expect(configuredRoot?.querySelector('[data-slot="slider-track"]')).toHaveClass('configured-slider-track', 'h-2.5');
    expect(configuredThumb).toHaveClass('configured-slider-thumb', 'border-warning', 'size-5.5');
    expect(overriddenRoot).toHaveClass('override-slider-root');
    expect(overriddenRoot).not.toHaveClass('configured-slider-root');
    expect(overriddenRoot?.querySelector('[data-slot="slider-track"]')).toHaveClass('bg-destructive/20', 'h-1.25');
    expect(overriddenThumb).toHaveClass('border-destructive', 'size-4');
  });
});
