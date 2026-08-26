import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Progress } from '../src/preset/progress';
import { render, screen } from './helpers/render';

describe('Progress', () => {
  it('renders progress state, variant classes and forwards the root ref', () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <Progress
        ref={ref}
        aria-label="Upload progress"
        className="custom-progress-root"
        classNames={{
          indicator: 'custom-progress-indicator',
          root: 'configured-progress-root'
        }}
        color="success"
        max={200}
        size="lg"
        value={50}
      />
    );

    const progress = screen.getByRole('progressbar', { name: 'Upload progress' });
    const indicator = document.querySelector('[data-slot="progress-indicator"]');

    expect(ref.current).toBe(progress);
    expect(progress).toHaveAttribute('data-slot', 'progress-root');
    expect(progress).toHaveAttribute('aria-valuemax', '200');
    expect(progress).toHaveAttribute('aria-valuenow', '50');
    expect(progress).toHaveClass('custom-progress-root', 'configured-progress-root', 'bg-success/20', 'h-3');
    expect(indicator).toHaveClass('custom-progress-indicator', 'bg-success');
    expect(indicator).toHaveStyle({ transform: 'translateX(-75%)' });
  });

  it('clamps values outside the valid range', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    try {
      const { rerender } = render(
        <Progress
          aria-label="Negative progress"
          max={100}
          value={-20}
        />
      );

      expect(document.querySelector('[data-slot="progress-indicator"]')).toHaveStyle({
        transform: 'translateX(-100%)'
      });

      rerender(
        <Progress
          aria-label="Overflow progress"
          max={100}
          value={250}
        />
      );

      expect(document.querySelector('[data-slot="progress-indicator"]')).toHaveStyle({
        transform: 'translateX(-0%)'
      });
      expect(consoleError).toHaveBeenCalledWith(expect.stringContaining('Invalid prop `value`'));
    }
    finally {
      consoleError.mockRestore();
    }
  });

  it('uses default progress values when value is missing or max is invalid', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    try {
      const { rerender } = render(<Progress aria-label="Default progress" />);

      expect(screen.getByRole('progressbar', { name: 'Default progress' })).not.toHaveAttribute('aria-valuenow');
      expect(document.querySelector('[data-slot="progress-indicator"]')).toHaveStyle({
        transform: 'translateX(-100%)'
      });

      rerender(
        <Progress
          aria-label="Invalid max progress"
          max={0}
          value={50}
        />
      );

      expect(document.querySelector('[data-slot="progress-indicator"]')).toHaveStyle({
        transform: 'translateX(-50%)'
      });
      expect(consoleError).toHaveBeenCalledWith(expect.stringContaining('Invalid prop `max`'));
    }
    finally {
      consoleError.mockRestore();
    }
  });
});
