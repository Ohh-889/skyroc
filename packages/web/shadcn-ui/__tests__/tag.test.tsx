import { describe, expect, it } from 'vitest';
import { ConfigProvider } from '../src/preset/config-provider';
import { Tag } from '../src/preset/tag';
import { render, screen } from './helpers/render';

describe('Tag', () => {
  it('renders tag variants with slot data and custom class names', () => {
    render(
      <Tag
        className="custom-tag"
        color="success"
        role="status"
        shape="rounded"
        size="xl"
        variant="soft"
      >
        Live
      </Tag>
    );

    const tag = screen.getByRole('status');

    expect(tag).toHaveAttribute('data-slot', 'tag');
    expect(tag).toHaveClass('custom-tag', 'rounded-full', 'h-6', 'px-3', 'text-sm');
    expect(tag).toHaveClass('border-0', 'bg-success/10', 'text-success');
    expect(tag).toHaveTextContent('Live');
  });

  it('uses ConfigProvider tag defaults and lets component props override them', () => {
    render(
      <ConfigProvider
        tag={{
          className: 'configured-tag',
          color: 'warning',
          shape: 'rounded',
          size: 'xs',
          variant: 'outline'
        }}
      >
        <Tag role="status">Configured</Tag>
        <Tag
          className="override-tag"
          color="destructive"
          role="status"
          size="lg"
          variant="solid"
        >
          Overridden
        </Tag>
      </ConfigProvider>
    );

    const configured = screen.getByText('Configured');
    const overridden = screen.getByText('Overridden');

    expect(configured).toHaveClass('configured-tag', 'border-warning', 'rounded-full', 'h-3.5');
    expect(configured).toHaveClass('bg-background', 'text-warning');
    expect(overridden).toHaveClass('override-tag', 'bg-destructive', 'text-destructive-foreground');
    expect(overridden).toHaveClass('h-5', 'px-2.5');
    expect(overridden).not.toHaveClass('configured-tag', 'h-3.5');
  });
});
