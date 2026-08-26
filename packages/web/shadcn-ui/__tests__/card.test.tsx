import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Card } from '../src/preset/card';
import { render, screen } from './helpers/render';

describe('Card', () => {
  it('renders title sections, extra content, scrollable content and string footer', () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <Card
        ref={ref}
        className="custom-card-root"
        classNames={{
          content: 'custom-card-content',
          footer: 'custom-card-footer',
          header: 'custom-card-header',
          root: 'configured-root',
          title: 'custom-card-title',
          titleRoot: 'custom-title-root'
        }}
        contentProps={{ 'aria-label': 'Card content' }}
        extra={<button type="button">Refresh</button>}
        footer="Updated now"
        scrollable
        title="Usage"
        titleLeading={<span aria-label="title leading">L</span>}
        titleTrailing={<span aria-label="title trailing">T</span>}
      >
        Usage details
      </Card>
    );

    const root = ref.current;
    const content = screen.getByLabelText('Card content');

    expect(root).toHaveAttribute('data-slot', 'card-root');
    expect(root).toHaveClass('custom-card-root');
    expect(root).not.toHaveClass('configured-root');
    expect(screen.getByText('Usage')).toHaveAttribute('data-slot', 'card-title');
    expect(screen.getByText('Usage')).toHaveClass('custom-card-title');
    expect(screen.getByLabelText('title leading')).toHaveTextContent('L');
    expect(screen.getByLabelText('title trailing')).toHaveTextContent('T');
    expect(screen.getByRole('button', { name: 'Refresh' })).toBeInTheDocument();
    expect(content).toHaveAttribute('data-slot', 'card-content');
    expect(content).toHaveClass('custom-card-content', 'overflow-auto');
    expect(screen.getByText('Updated now')).toHaveAttribute('data-slot', 'card-footer');
    expect(screen.getByText('Updated now')).toHaveClass('custom-card-footer');
  });

  it('uses configured root class names and custom header content', () => {
    render(
      <Card
        classNames={{ root: 'configured-root' }}
        header={<div>Custom header</div>}
        title="Ignored title"
      >
        Custom header body
      </Card>
    );

    expect(screen.getByText('Custom header').closest('[data-slot="card-header"]')).toBeInTheDocument();
    expect(screen.getByText('Custom header body').closest('[data-slot="card-root"]')).toHaveClass('configured-root');
    expect(screen.queryByText('Ignored title')).not.toBeInTheDocument();
  });

  it('supports custom title root and React node footers', () => {
    render(
      <Card
        footer={<button type="button">Save</button>}
        title="Title root trigger"
        titleRoot={<div data-testid="custom-title-root">Custom title root</div>}
      >
        Editable content
      </Card>
    );

    expect(screen.getByTestId('custom-title-root')).toHaveTextContent('Custom title root');
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    expect(screen.getByText('Editable content')).toHaveAttribute('data-slot', 'card-content');
  });

  it('renders React node titles directly', () => {
    render(
      <Card title={<span data-testid="node-title">Node title</span>}>
        Node title body
      </Card>
    );

    expect(screen.getByTestId('node-title')).toHaveTextContent('Node title');
    expect(screen.getByText('Node title body')).toHaveAttribute('data-slot', 'card-content');
  });

  it('renders without header and footer when no title or footer is provided', () => {
    render(<Card>Plain content</Card>);

    expect(screen.getByText('Plain content')).toHaveAttribute('data-slot', 'card-content');
    expect(document.querySelector('[data-slot="card-header"]')).not.toBeInTheDocument();
    expect(document.querySelector('[data-slot="card-footer"]')).not.toBeInTheDocument();
  });
});
