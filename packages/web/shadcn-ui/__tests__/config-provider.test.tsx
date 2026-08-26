import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Button } from '../src/preset/button';
import { ConfigProvider } from '../src/preset/config-provider';
import { useComponentConfig } from '../src/preset/config-provider/context';

interface ConfigProbeProps {
  /** Accessible label used to query the rendered config probe. */
  label: string;
}

const ConfigProbe = (props: ConfigProbeProps) => {
  const { label } = props;
  const config = useComponentConfig('button') as {
    /** Theme color injected by the config provider. */
    color?: string;
    /** Text direction injected for components that accept direction. */
    dir?: string;
    /** Component size injected by the config provider. */
    size?: string;
  };

  return (
    <output
      aria-label={label}
      data-color={config.color}
      data-dir={config.dir}
      data-size={config.size}
    />
  );
};

describe('ConfigProvider', () => {
  it('provides size, direction and component defaults to component configs', () => {
    render(
      <ConfigProvider
        button={{ color: 'destructive' }}
        direction="rtl"
        size="lg"
      >
        <ConfigProbe label="button config" />
      </ConfigProvider>
    );

    const output = screen.getByLabelText('button config');

    expect(output).toHaveAttribute('data-color', 'destructive');
    expect(output).toHaveAttribute('data-size', 'lg');
    expect(output).toHaveAttribute('data-dir', 'rtl');
  });

  it('lets component props override provider defaults', () => {
    render(
      <ConfigProvider
        button={{ color: 'destructive', size: 'lg' }}
      >
        <Button
          color="success"
          size="sm"
        >
          Save
        </Button>
      </ConfigProvider>
    );

    const button = screen.getByRole('button', { name: 'Save' });

    expect(button).toHaveClass('focus-visible:ring-success', 'text-xs');
    expect(button).not.toHaveClass('focus-visible:ring-destructive', 'text-base');
  });
});
