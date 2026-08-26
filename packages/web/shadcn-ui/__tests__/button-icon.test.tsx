import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ButtonIcon } from '../src/preset/button';
import { render, screen } from './helpers/render';

vi.mock('@iconify/react', () => ({
  Icon: (props: { icon: string }) => <span data-icon={props.icon} data-testid="iconify-icon" />
}));

describe('ButtonIcon', () => {
  it('renders an icon-only button with accessible label and forwards refs', () => {
    const ref = createRef<HTMLButtonElement>();

    render(
      <ButtonIcon
        ref={ref}
        aria-label="Open settings"
        className="custom-icon-button"
        icon="lucide:settings"
      />
    );

    const button = screen.getByRole('button', { name: 'Open settings' });

    expect(ref.current).toBe(button);
    expect(button).toHaveClass('custom-icon-button');
    expect(screen.getByTestId('iconify-icon')).toHaveAttribute('data-icon', 'lucide:settings');
  });

  it('renders children instead of the icon fallback when children are provided', () => {
    render(
      <ButtonIcon icon="lucide:settings">
        Custom action
      </ButtonIcon>
    );

    const button = screen.getByRole('button', { name: 'Custom action' });

    expect(button).toHaveTextContent('Custom action');
    expect(screen.queryByTestId('iconify-icon')).not.toBeInTheDocument();
  });
});
