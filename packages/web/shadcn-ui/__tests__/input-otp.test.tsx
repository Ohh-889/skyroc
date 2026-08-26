import { createRef } from 'react';
import { act } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { InputOTP } from '../src/preset/input-otp';
import { render, screen, setupUser, waitFor } from './helpers/render';

describe('InputOTP', () => {
  afterEach(async () => {
    await act(async () => {
      await new Promise<void>(resolve => {
        setTimeout(resolve, 60);
      });
    });
  });

  it('accepts typed values and emits change and complete callbacks', async () => {
    const user = setupUser();
    const ref = createRef<HTMLInputElement>();
    const onChange = vi.fn();
    const onComplete = vi.fn();

    render(
      <InputOTP
        ref={ref}
        aria-label="Security code"
        className="custom-otp-root"
        classNames={{ root: 'configured-otp-root' }}
        inputCount={4}
        onChange={onChange}
        onComplete={onComplete}
      />
    );

    const input = screen.getByRole('textbox', { name: 'Security code' });
    const root = document.querySelector('[data-slot="input-otp-root"]');

    expect(ref.current).toBe(input);
    expect(root).toHaveClass('custom-otp-root');
    expect(root).not.toHaveClass('configured-otp-root');
    expect(document.querySelectorAll('[data-slot="input-otp-slot"]')).toHaveLength(4);
    expect(document.querySelector('[data-slot="input-otp-separator"]')).not.toBeInTheDocument();

    await user.type(input, '1234');

    expect(input).toHaveValue('1234');
    expect(onChange).toHaveBeenLastCalledWith('1234');
    await waitFor(() => {
      expect(onComplete).toHaveBeenLastCalledWith('1234');
    });
  });

  it('renders masked configured slots with custom separators and active caret state', async () => {
    const user = setupUser();

    render(
      <InputOTP
        mask
        aria-label="Masked code"
        classNames={{
          group: 'configured-otp-group',
          input: 'configured-otp-slot',
          root: 'configured-otp-root',
          separator: 'configured-otp-separator'
        }}
        inputCount={4}
        separator={<span aria-label="Dash separator">-</span>}
        size="lg"
        value="12"
        onChange={vi.fn()}
      />
    );

    const input = screen.getByRole('textbox', { name: 'Masked code' });
    const slots = Array.from(document.querySelectorAll('[data-slot="input-otp-slot"]'));
    const separators = Array.from(document.querySelectorAll('[data-slot="input-otp-separator"]'));

    expect(document.querySelector('[data-slot="input-otp-root"]')).toHaveClass('configured-otp-root');
    expect(document.querySelector('[data-slot="input-otp-group"]')).toHaveClass('configured-otp-group');
    expect(slots).toHaveLength(4);
    expect(slots[0]).toHaveClass('configured-otp-slot');
    expect(slots[0]).toHaveTextContent('\u25CF');
    expect(slots[1]).toHaveTextContent('\u25CF');
    expect(separators).toHaveLength(3);
    expect(separators[0]).toHaveClass('configured-otp-separator');
    expect(screen.getAllByLabelText('Dash separator')).toHaveLength(3);

    await user.click(input);

    await waitFor(() => {
      expect(slots[2]).toHaveAttribute('data-has-fake-caret', 'true');
    });
  });

  it('uses the default separator icon for non-element separator content', () => {
    render(
      <InputOTP
        aria-label="Separated code"
        inputCount={3}
        separator
      />
    );

    const separators = Array.from(document.querySelectorAll('[data-slot="input-otp-separator"]'));

    expect(separators).toHaveLength(2);
    expect(separators.every(separator => Boolean(separator.querySelector('svg')))).toBe(true);
  });
});
