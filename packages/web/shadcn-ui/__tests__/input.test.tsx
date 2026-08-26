import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Input } from '../src/preset/input';
import { render, screen, setupUser } from './helpers/render';

describe('Input', () => {
  it('renders adornments, forwards the input ref, and clears the current value', async () => {
    const user = setupUser();
    const ref = createRef<HTMLInputElement>();
    const onChange = vi.fn();

    const { container } = render(
      <Input
        clearable
        ref={ref}
        aria-label="Search"
        className="custom-input-root"
        defaultValue="soybean"
        leading={<span aria-label="search leading">S</span>}
        trailing={<span aria-label="search trailing">T</span>}
        onChange={onChange}
      />
    );

    const input = screen.getByRole('textbox', { name: 'Search' });
    const root = input.closest('[data-slot="input-root"]');
    const clearable = container.querySelector('[data-slot="input-clearable"]');

    expect(ref.current).toBe(input);
    expect(root).toHaveClass('custom-input-root');
    expect(screen.getByLabelText('search leading')).toHaveTextContent('S');
    expect(screen.getByLabelText('search trailing')).toHaveTextContent('T');

    await user.clear(input);
    await user.type(input, 'admin');

    expect(input).toHaveValue('admin');
    expect(onChange).toHaveBeenCalled();

    await user.click(clearable!);

    expect(input).toHaveValue('');
  });

  it('uses configured slot classes when root className is not provided', () => {
    const { container } = render(
      <Input
        clearable
        aria-label="Configured input"
        classNames={{
          clearable: 'configured-clearable',
          control: 'configured-control',
          root: 'configured-root'
        }}
      />
    );

    const input = screen.getByRole('textbox', { name: 'Configured input' });
    const root = input.closest('[data-slot="input-root"]');
    const clearable = container.querySelector('[data-slot="input-clearable"]');

    expect(root).toHaveClass('configured-root');
    expect(input).toHaveClass('configured-control');
    expect(clearable).toHaveClass('configured-clearable');
  });

  it('marks disabled and read only state on both root and control', () => {
    const { rerender } = render(
      <Input
        disabled
        aria-label="Disabled input"
      />
    );

    const disabledInput = screen.getByRole('textbox', { name: 'Disabled input' });
    const disabledRoot = disabledInput.closest('[data-slot="input-root"]');

    expect(disabledInput).toBeDisabled();
    expect(disabledInput).toHaveAttribute('aria-disabled', 'true');
    expect(disabledRoot).toHaveAttribute('data-disabled');

    rerender(
      <Input
        readOnly
        aria-label="Readonly input"
      />
    );

    const readonlyInput = screen.getByRole('textbox', { name: 'Readonly input' });
    const readonlyRoot = readonlyInput.closest('[data-slot="input-root"]');

    expect(readonlyInput).toBeDisabled();
    expect(readonlyInput).toHaveAttribute('readonly');
    expect(readonlyRoot).toHaveAttribute('data-readonly');
  });

});
