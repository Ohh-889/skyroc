import { describe, expect, it, vi } from 'vitest';
import { ConfigProvider } from '../src/preset/config-provider';
import { Toggle } from '../src/preset/toggle';
import { render, screen, setupUser } from './helpers/render';

describe('Toggle', () => {
  it('renders styled toggle buttons and emits pressed changes', async () => {
    const user = setupUser();
    const onPressedChange = vi.fn();

    render(
      <Toggle
        aria-label="Bold"
        className="custom-toggle"
        size="lg"
        variant="outline"
        onPressedChange={onPressedChange}
      >
        B
      </Toggle>
    );

    const toggle = screen.getByRole('button', { name: 'Bold' });

    expect(toggle).toHaveAttribute('data-slot', 'toggle');
    expect(toggle).toHaveAttribute('data-state', 'off');
    expect(toggle).toHaveClass('custom-toggle', 'h-9', 'px-6', 'border');
    expect(toggle).toHaveTextContent('B');

    await user.click(toggle);

    expect(onPressedChange).toHaveBeenCalledWith(true);
    expect(toggle).toHaveAttribute('data-state', 'on');
  });

  it('uses ConfigProvider toggle defaults and lets component props override them', () => {
    render(
      <ConfigProvider
        toggle={{
          className: 'configured-toggle',
          size: 'xs',
          variant: 'outline'
        }}
      >
        <Toggle aria-label="Configured toggle">C</Toggle>
        <Toggle
          aria-label="Overridden toggle"
          className="override-toggle"
          size="xl"
          variant="ghost"
        >
          O
        </Toggle>
      </ConfigProvider>
    );

    const configured = screen.getByRole('button', { name: 'Configured toggle' });
    const overridden = screen.getByRole('button', { name: 'Overridden toggle' });

    expect(configured).toHaveClass('configured-toggle', 'h-6', 'px-1.5', 'border');
    expect(overridden).toHaveClass('override-toggle', 'h-10', 'px-8', 'bg-transparent');
    expect(overridden).not.toHaveClass('configured-toggle', 'h-6', 'border');
  });
});
