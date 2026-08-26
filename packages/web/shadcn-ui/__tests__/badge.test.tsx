import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Badge } from '../src/preset/badge';
import { render, screen } from './helpers/render';

describe('Badge', () => {
  it('renders children and visible badge content with slot class names', () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <Badge
        ref={ref}
        className="custom-badge-root"
        classNames={{ content: 'custom-badge-content', root: 'configured-root' }}
        color="success"
        content="3"
        data-testid="badge-root"
        position="top-right"
        size="sm"
      >
        <button type="button">Inbox</button>
      </Badge>
    );

    const root = screen.getByTestId('badge-root');
    const content = screen.getByText('3');

    expect(ref.current).toBe(root);
    expect(root).toHaveAttribute('data-slot', 'badge-root');
    expect(root).toHaveClass('custom-badge-root');
    expect(root).not.toHaveClass('configured-root');
    expect(screen.getByRole('button', { name: 'Inbox' })).toBeInTheDocument();
    expect(content).toHaveAttribute('data-slot', 'badge-content');
    expect(content).toHaveClass('custom-badge-content');
  });

  it('uses configured root class names and hides badge content when closed', () => {
    render(
      <Badge
        classNames={{ root: 'configured-root' }}
        content="9"
        data-testid="badge-root"
        open={false}
      >
        Notifications
      </Badge>
    );

    const root = screen.getByTestId('badge-root');

    expect(root).toHaveClass('configured-root');
    expect(root).toHaveTextContent('Notifications');
    expect(screen.queryByText('9')).not.toBeInTheDocument();
    expect(root.querySelector('[data-slot="badge-content"]')).not.toBeInTheDocument();
  });
});
