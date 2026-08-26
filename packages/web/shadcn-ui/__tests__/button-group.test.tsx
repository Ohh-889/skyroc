import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Button, ButtonGroup } from '../src/preset/button';
import { render, screen } from './helpers/render';

describe('ButtonGroup', () => {
  it('groups related buttons with horizontal orientation by default', () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <ButtonGroup
        ref={ref}
        aria-label="Pagination actions"
        className="custom-button-group"
      >
        <Button>Previous</Button>
        <Button>Next</Button>
      </ButtonGroup>
    );

    const group = screen.getByRole('group', { name: 'Pagination actions' });

    expect(ref.current).toBe(group);
    expect(group).toHaveAttribute('data-slot', 'button-group');
    expect(group).toHaveClass('custom-button-group');
    expect(screen.getByRole('button', { name: 'Previous' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
  });

  it('supports vertical orientation', () => {
    render(
      <ButtonGroup
        aria-label="Stacked actions"
        orientation="vertical"
      >
        <Button>Approve</Button>
        <Button>Reject</Button>
      </ButtonGroup>
    );

    expect(screen.getByRole('group', { name: 'Stacked actions' })).toHaveClass('flex-col');
  });
});
