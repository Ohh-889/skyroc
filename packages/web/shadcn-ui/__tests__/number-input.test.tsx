import { describe, expect, it, vi } from 'vitest';
import { NumberInput } from '../src/preset/number-input';
import { render, screen, setupUser } from './helpers/render';

describe('NumberInput', () => {
  it('steps values from buttons and keyboard while respecting min and max', async () => {
    const user = setupUser();
    const onValueChange = vi.fn();

    render(
      <NumberInput
        aria-label="Quantity"
        defaultValue={2}
        max={5}
        min={0}
        step={2}
        onValueChange={onValueChange}
      />
    );

    const input = screen.getByRole('spinbutton', { name: 'Quantity' });

    await user.click(screen.getByRole('button', { name: 'Increment' }));
    expect(input).toHaveValue('4');
    expect(onValueChange).toHaveBeenLastCalledWith(4);

    await user.click(screen.getByRole('button', { name: 'Increment' }));
    expect(input).toHaveValue('5');
    expect(onValueChange).toHaveBeenLastCalledWith(5);

    await user.click(screen.getByRole('button', { name: 'Decrement' }));
    expect(input).toHaveValue('3');
    expect(onValueChange).toHaveBeenLastCalledWith(3);

    await user.click(input);
    await user.keyboard('{ArrowDown}');

    expect(input).toHaveValue('1');
    expect(onValueChange).toHaveBeenLastCalledWith(1);
  });

  it('starts step actions from zero when the current value is empty', async () => {
    const user = setupUser();
    const onValueChange = vi.fn();

    render(
      <NumberInput
        aria-label="Empty quantity"
        step={3}
        onValueChange={onValueChange}
      />
    );

    const input = screen.getByRole('spinbutton', { name: 'Empty quantity' });

    await user.click(screen.getByRole('button', { name: 'Increment' }));

    expect(input).toHaveValue('3');
    expect(onValueChange).toHaveBeenLastCalledWith(3);
  });

  it('treats non numeric string values as empty numeric state for stepping', async () => {
    const user = setupUser();
    const onValueChange = vi.fn();

    render(
      <NumberInput
        aria-label="String quantity"
        defaultValue="invalid"
        step={2}
        onValueChange={onValueChange}
      />
    );

    const input = screen.getByRole('spinbutton', { name: 'String quantity' });

    expect(input).toHaveValue('invalid');

    await user.click(screen.getByRole('button', { name: 'Increment' }));

    expect(input).toHaveValue('2');
    expect(onValueChange).toHaveBeenLastCalledWith(2);
  });

  it('accepts numeric input and ignores invalid characters', async () => {
    const user = setupUser();
    const onValueChange = vi.fn();

    render(
      <NumberInput
        aria-label="Amount"
        onValueChange={onValueChange}
      />
    );

    const input = screen.getByRole('spinbutton', { name: 'Amount' });

    await user.type(input, '12a');

    expect(input).toHaveValue('12');
    expect(onValueChange).toHaveBeenLastCalledWith(12);
    expect(onValueChange).not.toHaveBeenCalledWith('12a');
  });

  it('leaves empty blur untouched and clamps bounded values on blur', async () => {
    const user = setupUser();
    const onEmptyChange = vi.fn();

    const { unmount } = render(
      <NumberInput
        aria-label="Empty amount"
        onValueChange={onEmptyChange}
      />
    );

    const emptyInput = screen.getByRole('spinbutton', { name: 'Empty amount' });

    await user.click(emptyInput);
    await user.tab();

    expect(emptyInput).toHaveValue('');
    expect(onEmptyChange).not.toHaveBeenCalled();

    unmount();

    const onBoundedChange = vi.fn();

    render(
      <NumberInput
        aria-label="Bounded amount"
        defaultValue={10}
        max={5}
        onValueChange={onBoundedChange}
      />
    );

    const boundedInput = screen.getByRole('spinbutton', { name: 'Bounded amount' });

    await user.click(boundedInput);
    await user.tab();

    expect(boundedInput).toHaveValue('5');
    expect(onBoundedChange).toHaveBeenLastCalledWith(5);
  });

  it('clears the value and keeps the input focusable', async () => {
    const user = setupUser();
    const onValueChange = vi.fn();

    const { container } = render(
      <NumberInput
        clearable
        aria-label="Score"
        defaultValue={3}
        onValueChange={onValueChange}
      />
    );

    const input = screen.getByRole('spinbutton', { name: 'Score' });
    const clearIcon = container.querySelector('.lucide-x');

    expect(clearIcon).toBeInTheDocument();

    await user.click(clearIcon!);

    expect(input).toHaveValue('');
    expect(input).toHaveFocus();
    expect(onValueChange).toHaveBeenLastCalledWith(undefined);
  });

  it('handles keyboard increment and escape blur while focused', async () => {
    const user = setupUser();
    const onValueChange = vi.fn();

    render(
      <NumberInput
        aria-label="Keyboard amount"
        defaultValue={2}
        onValueChange={onValueChange}
      />
    );

    const input = screen.getByRole('spinbutton', { name: 'Keyboard amount' });

    await user.click(input);
    await user.keyboard('{ArrowUp}');

    expect(input).toHaveValue('3');
    expect(input).toHaveFocus();
    expect(onValueChange).toHaveBeenLastCalledWith(3);

    await user.keyboard('{Escape}');

    expect(input).not.toHaveFocus();
  });

  it('ignores keyboard shortcuts when read only', async () => {
    const user = setupUser();
    const onValueChange = vi.fn();

    render(
      <NumberInput
        readOnly
        aria-label="Readonly keyboard amount"
        defaultValue={4}
        onValueChange={onValueChange}
      />
    );

    const input = screen.getByRole('spinbutton', { name: 'Readonly keyboard amount' });

    await user.click(input);
    await user.keyboard('{ArrowUp}{ArrowDown}{Escape}');

    expect(input).toHaveValue('4');
    expect(input).toHaveFocus();
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('disables all interactions when disabled or read only', async () => {
    const user = setupUser();
    const disabledChange = vi.fn();
    const readOnlyChange = vi.fn();

    const { rerender } = render(
      <NumberInput
        disabled
        aria-label="Disabled amount"
        defaultValue={4}
        onValueChange={disabledChange}
      />
    );

    expect(screen.getByRole('spinbutton', { name: 'Disabled amount' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Increment' })).toBeDisabled();

    await user.click(screen.getByRole('button', { name: 'Increment' }));
    expect(disabledChange).not.toHaveBeenCalled();

    rerender(
      <NumberInput
        readOnly
        aria-label="Readonly amount"
        defaultValue={4}
        onValueChange={readOnlyChange}
      />
    );

    expect(screen.getByRole('spinbutton', { name: 'Readonly amount' })).toHaveAttribute('readonly');
    expect(screen.getByRole('button', { name: 'Increment' })).toBeDisabled();

    await user.click(screen.getByRole('button', { name: 'Increment' }));
    expect(readOnlyChange).not.toHaveBeenCalled();
  });
});
