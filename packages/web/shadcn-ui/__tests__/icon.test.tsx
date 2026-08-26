import { describe, expect, it, vi } from 'vitest';
import { Icon } from '../src/preset/icon';
import { ConfigProvider } from '../src/preset/config-provider';
import { render, screen } from './helpers/render';

interface IconifyMockProps {
  /** CSS class passed through to the Iconify renderer. */
  className?: string;

  /** Icon color passed through to the Iconify renderer. */
  color?: string;

  /** Icon height after component defaults and provider config are merged. */
  height?: number | string;

  /** Icon name resolved by Iconify. */
  icon: string;

  /** Icon width after component defaults and provider config are merged. */
  width?: number | string;
}

vi.mock('@iconify/react', () => ({
  Icon: (props: IconifyMockProps) => {
    const { className, color, height, icon, width } = props;

    return (
      <span
        className={className}
        data-color={color}
        data-height={height}
        data-icon={icon}
        data-testid="iconify-icon"
        data-width={width}
      />
    );
  }
}));

describe('Icon', () => {
  it('renders Iconify icons with default dimensions', () => {
    render(<Icon icon="lucide:home" />);

    const icon = screen.getByTestId('iconify-icon');

    expect(icon).toHaveAttribute('data-icon', 'lucide:home');
    expect(icon).toHaveAttribute('data-height', '1.25em');
    expect(icon).toHaveAttribute('data-width', '1.25em');
  });

  it('lets props override provider icon defaults', () => {
    render(
      <ConfigProvider icon={{ color: 'red', height: 32, width: 32 }}>
        <Icon
          className="custom-icon"
          color="blue"
          height={16}
          icon="lucide:settings"
          width={20}
        />
      </ConfigProvider>
    );

    const icon = screen.getByTestId('iconify-icon');

    expect(icon).toHaveClass('custom-icon');
    expect(icon).toHaveAttribute('data-color', 'blue');
    expect(icon).toHaveAttribute('data-height', '16');
    expect(icon).toHaveAttribute('data-width', '20');
  });
});
