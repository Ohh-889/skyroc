import { describe, expect, it, vi } from 'vitest';
import { ToggleGroup } from '../src/components/toggle-group';
import { render, screen, setupUser } from './helpers/render';

describe('ToggleGroup', () => {
  it('renders item data, custom item render output and emits multiple values', async () => {
    const user = setupUser();
    const onValueChange = vi.fn();

    render(
      <ToggleGroup
        className="custom-toggle-group"
        classNames={{
          groupRoot: 'custom-toggle-group-root',
          toggle: 'custom-toggle-group-item'
        }}
        defaultValue={['bold']}
        items={[
          { label: 'Bold', value: 'bold' },
          { label: 'Italic', value: 'italic' },
          { disabled: true, label: 'Underline', value: 'underline' }
        ]}
        size="sm"
        type="multiple"
        variant="outline"
        itemRender={item => (
          <span>
            Format
            {' '}
            {item.label}
          </span>
        )}
        onValueChange={onValueChange}
      />
    );

    const root = screen.getByRole('group');
    const bold = screen.getByRole('button', { name: 'Format Bold' });
    const italic = screen.getByRole('button', { name: 'Format Italic' });
    const underline = screen.getByRole('button', { name: 'Format Underline' });

    expect(root).toHaveAttribute('data-slot', 'toggle-group');
    expect(root).toHaveAttribute('data-size', 'sm');
    expect(root).toHaveClass('custom-toggle-group-root', 'custom-toggle-group', 'gap-1.75');
    expect(bold).toHaveAttribute('data-slot', 'toggle-group-item');
    expect(bold).toHaveAttribute('data-state', 'on');
    expect(bold).toHaveClass('custom-toggle-group-item', 'h-7', 'px-2', 'border');
    expect(underline).toBeDisabled();

    await user.click(italic);

    expect(onValueChange).toHaveBeenCalledWith(['bold', 'italic']);
    expect(italic).toHaveAttribute('data-state', 'on');
  });

  it('supports single selection and per-item class names', async () => {
    const user = setupUser();
    const onValueChange = vi.fn();

    render(
      <ToggleGroup
        items={[
          { className: 'left-align-toggle', label: 'Left', value: 'left' },
          { label: 'Center', value: 'center' }
        ]}
        type="single"
        onValueChange={onValueChange}
      />
    );

    const left = screen.getByRole('radio', { name: 'Left' });
    const center = screen.getByRole('radio', { name: 'Center' });

    expect(left).toHaveClass('left-align-toggle');

    await user.click(center);

    expect(onValueChange).toHaveBeenCalledWith('center');
    expect(center).toHaveAttribute('data-state', 'on');
  });
});
