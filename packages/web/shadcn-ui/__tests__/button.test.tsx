import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Button } from '../src/preset/button';

describe('Button', () => {
  it('renders children with leading and trailing content', () => {
    render(
      <Button
        leading={<span aria-label="leading">Before</span>}
        trailing={<span aria-label="trailing">After</span>}
      >
        Save
      </Button>
    );

    const button = screen.getByRole('button', { name: /Save/ });

    expect(button).toHaveClass('inline-flex');
    expect(screen.getByLabelText('leading')).toHaveTextContent('Before');
    expect(screen.getByLabelText('trailing')).toHaveTextContent('After');
  });

  it('disables the button and renders a loading indicator while loading', () => {
    const { container } = render(
      <Button loading>Save</Button>
    );

    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('renders the child element when asChild is enabled', () => {
    render(
      <Button
        asChild
        className="custom-link-button"
      >
        <a href="/components/button">Button docs</a>
      </Button>
    );

    const link = screen.getByRole('link', { name: 'Button docs' });

    expect(link).toHaveAttribute('href', '/components/button');
    expect(link).toHaveClass('inline-flex', 'custom-link-button');
  });

  it('forwards refs to the underlying button element', () => {
    const ref = createRef<HTMLButtonElement>();

    render(<Button ref={ref}>Focusable</Button>);

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current).toHaveTextContent('Focusable');
  });
});
