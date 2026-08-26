import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { AspectRatio } from '../src/preset/aspect-ratio';
import { render, screen } from './helpers/render';

describe('AspectRatio', () => {
  it('keeps its content inside a fixed ratio wrapper', () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <AspectRatio
        ref={ref}
        className="media-frame"
        data-testid="aspect-frame"
        ratio={16 / 9}
      >
        <img
          alt="Dashboard preview"
          src="/preview.png"
        />
      </AspectRatio>
    );

    const frame = screen.getByTestId('aspect-frame');

    expect(ref.current).toBe(frame);
    expect(frame).toHaveAttribute('data-slot', 'aspect-ratio');
    expect(frame).toHaveClass('media-frame');
    expect(frame).toHaveStyle({ bottom: '0px', left: '0px', position: 'absolute', right: '0px', top: '0px' });
    expect(frame.parentElement).toHaveAttribute('data-radix-aspect-ratio-wrapper', '');
    expect(frame.parentElement).toHaveStyle({ paddingBottom: '56.25%' });
    expect(screen.getByRole('img', { name: 'Dashboard preview' })).toBeInTheDocument();
  });
});
