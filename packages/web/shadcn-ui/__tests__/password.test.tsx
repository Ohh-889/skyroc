import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Password } from '../src/preset/password';
import { render, screen, setupUser } from './helpers/render';

describe('Password', () => {
  it('toggles uncontrolled visibility, keeps input behavior and forwards the ref', async () => {
    const user = setupUser();
    const ref = createRef<HTMLInputElement>();
    const onChange = vi.fn();
    const onVisibleChange = vi.fn();

    const { container } = render(
      <Password
        clearable
        ref={ref}
        aria-label="Account password"
        className="custom-password-root"
        defaultValue="secret"
        trailing={<span aria-label="password trailing">Required</span>}
        onChange={onChange}
        onVisibleChange={onVisibleChange}
      />
    );

    const input = screen.getByLabelText('Account password');
    const root = input.closest('[data-slot="input-root"]');
    const visibleToggle = container.querySelector('[data-slot="password-visible"]');
    const clearable = container.querySelector('[data-slot="input-clearable"]');

    expect(ref.current).toBe(input);
    expect(input).toHaveAttribute('data-slot', 'password');
    expect(input).toHaveAttribute('type', 'password');
    expect(root).toHaveClass('custom-password-root');
    expect(screen.getByLabelText('password trailing')).toHaveTextContent('Required');
    expect(visibleToggle?.querySelector('.lucide-eye-off')).toBeInTheDocument();

    await user.click(visibleToggle!);

    expect(input).toHaveAttribute('type', 'text');
    expect(onVisibleChange).toHaveBeenLastCalledWith(true);
    expect(visibleToggle?.querySelector('.lucide-eye')).toBeInTheDocument();

    await user.clear(input);
    await user.type(input, 'updated');

    expect(input).toHaveValue('updated');
    expect(onChange).toHaveBeenCalled();

    await user.click(clearable!);

    expect(input).toHaveValue('');
  });

  it('supports controlled visibility and custom visible icons', async () => {
    const user = setupUser();
    const onVisibleChange = vi.fn();

    const { container, rerender } = render(
      <Password
        visible
        aria-label="Controlled password"
        hiddenIcon={<span aria-label="custom hidden icon">Hidden</span>}
        visibleIcon={<span aria-label="custom visible icon">Visible</span>}
        onVisibleChange={onVisibleChange}
      />
    );

    const input = screen.getByLabelText('Controlled password');
    const visibleToggle = container.querySelector('[data-slot="password-visible"]');

    expect(input).toHaveAttribute('type', 'text');
    expect(screen.getByLabelText('custom visible icon')).toHaveTextContent('Visible');

    await user.click(visibleToggle!);

    expect(onVisibleChange).toHaveBeenLastCalledWith(false);
    expect(input).toHaveAttribute('type', 'text');

    rerender(
      <Password
        aria-label="Controlled password"
        hiddenIcon={<span aria-label="custom hidden icon">Hidden</span>}
        visible={false}
        visibleIcon={<span aria-label="custom visible icon">Visible</span>}
        onVisibleChange={onVisibleChange}
      />
    );

    expect(input).toHaveAttribute('type', 'password');
    expect(screen.getByLabelText('custom hidden icon')).toHaveTextContent('Hidden');

    await user.click(container.querySelector('[data-slot="password-visible"]')!);

    expect(onVisibleChange).toHaveBeenLastCalledWith(true);
  });

  it('uses configured slot classes when root className is not provided', () => {
    const { container } = render(
      <Password
        aria-label="Configured password"
        classNames={{
          control: 'configured-password-control',
          root: 'configured-password-root'
        }}
      />
    );

    expect(screen.getByLabelText('Configured password')).toHaveClass('configured-password-control');
    expect(container.querySelector('[data-slot="input-root"]')).toHaveClass('configured-password-root');
  });
});
