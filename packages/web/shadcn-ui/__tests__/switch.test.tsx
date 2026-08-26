import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ConfigProvider } from '../src/preset/config-provider';
import { Switch } from '../src/preset/switch';
import { render, screen, setupUser } from './helpers/render';

describe('Switch', () => {
  it('renders slot class names, forwarded refs and toggles checked state', async () => {
    const user = setupUser();
    const ref = createRef<HTMLButtonElement>();
    const onCheckedChange = vi.fn();

    render(
      <Switch
        ref={ref}
        aria-label="Airplane mode"
        className="custom-switch-root"
        classNames={{
          root: 'configured-switch-root',
          thumb: 'custom-switch-thumb'
        }}
        color="success"
        size="lg"
        onCheckedChange={onCheckedChange}
      >
        On
      </Switch>
    );

    const control = screen.getByRole('switch', { name: 'Airplane mode' });
    const thumb = document.querySelector('#switch-thumb');

    expect(ref.current).toBe(control);
    expect(control).toHaveClass('custom-switch-root', 'h-5.5', 'w-10');
    expect(control).not.toHaveClass('configured-switch-root');
    expect(control).toHaveAttribute('data-state', 'unchecked');
    expect(thumb).toHaveClass('custom-switch-thumb', 'size-4.5');
    expect(thumb).toHaveTextContent('On');

    await user.click(control);

    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(control).toHaveAttribute('data-state', 'checked');
  });

  it('uses ConfigProvider switch defaults and lets component props override them', () => {
    render(
      <ConfigProvider
        switch={{
          className: 'configured-switch-root',
          classNames: {
            thumb: 'configured-switch-thumb'
          },
          color: 'warning',
          size: 'xs'
        }}
      >
        <Switch aria-label="Configured switch" />
        <Switch
          aria-label="Overridden switch"
          className="override-switch-root"
          color="destructive"
          size="xl"
        />
      </ConfigProvider>
    );

    const configured = screen.getByRole('switch', { name: 'Configured switch' });
    const overridden = screen.getByRole('switch', { name: 'Overridden switch' });
    const configuredThumb = configured.querySelector('#switch-thumb');
    const overriddenThumb = overridden.querySelector('#switch-thumb');

    expect(configured).toHaveClass('configured-switch-root', 'h-4', 'w-7');
    expect(configured).toHaveClass('data-[state=checked]:bg-warning');
    expect(configuredThumb).toHaveClass('configured-switch-thumb', 'size-3');
    expect(overridden).toHaveClass('override-switch-root', 'h-6', 'w-11');
    expect(overridden).toHaveClass('data-[state=checked]:bg-destructive');
    expect(overridden).not.toHaveClass('configured-switch-root', 'h-4', 'w-7');
    expect(overriddenThumb).toHaveClass('size-5');
  });
});
