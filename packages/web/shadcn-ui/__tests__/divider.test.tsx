import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Divider } from '../src/preset/divider';
import { render, screen } from './helpers/render';

describe('Divider', () => {
  it('renders labeled horizontal dividers with leading and trailing slots', () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <Divider
        ref={ref}
        align="start"
        border="dashed"
        className="custom-divider-root"
        classNames={{
          label: 'custom-divider-label',
          root: 'configured-divider-root'
        }}
        leading={<span>Before</span>}
        size="lg"
        trailing={<span>After</span>}
      >
        General
      </Divider>
    );

    const separator = screen.getByRole('separator');

    expect(ref.current).toBe(separator);
    expect(separator).toHaveClass('custom-divider-root');
    expect(separator).not.toHaveClass('configured-divider-root');
    expect(screen.getByText('Before')).toBeInTheDocument();
    expect(screen.getByText('General')).toHaveClass('custom-divider-label');
    expect(screen.getByText('After')).toBeInTheDocument();
  });

  it('uses configured root classes and supports vertical dividers without labels', () => {
    render(
      <Divider
        aria-label="Vertical divider"
        classNames={{ root: 'configured-divider-root' }}
        orientation="vertical"
      />
    );

    const separator = screen.getByRole('separator', { name: 'Vertical divider' });

    expect(separator).toHaveAttribute('data-orientation', 'vertical');
    expect(separator).toHaveClass('configured-divider-root');
    expect(screen.queryByText('General')).not.toBeInTheDocument();
  });
});
