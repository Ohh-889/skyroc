import { describe, expect, it } from 'vitest';
import { Arrow } from '../src/components/arrow';
import { render, screen } from './helpers/render';

describe('Arrow', () => {
  it('renders the Radix arrow with custom dimensions and class name', () => {
    render(
      <Arrow
        aria-label="Floating arrow"
        className="custom-arrow"
        height={8}
        width={16}
      />
    );

    const arrow = screen.getByLabelText('Floating arrow');

    expect(arrow.tagName.toLowerCase()).toBe('svg');
    expect(arrow).toHaveClass('custom-arrow');
    expect(arrow).toHaveAttribute('height', '8');
    expect(arrow).toHaveAttribute('width', '16');
  });
});
