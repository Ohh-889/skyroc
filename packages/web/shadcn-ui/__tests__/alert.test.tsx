import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Alert } from '../src/preset/alert';
import { render, screen } from './helpers/render';

describe('Alert', () => {
  it('renders an accessible alert with title and description', () => {
    render(
      <Alert
        color="info"
        description="The deployment finished successfully."
        title="Deployment complete"
        variant="soft"
      />
    );

    const alert = screen.getByRole('alert');

    expect(alert).toHaveAttribute('data-slot', 'alert-root');
    expect(alert).toHaveTextContent('Deployment complete');
    expect(alert).toHaveTextContent('The deployment finished successfully.');
  });

  it('renders icon, leading, trailing and custom body content', () => {
    render(
      <Alert
        description="Review the failed checks before retrying."
        icon={<span aria-label="warning icon">!</span>}
        leading={<span aria-label="leading content">Before</span>}
        title="Build failed"
        trailing={<button type="button">Retry</button>}
      >
        <a href="/logs">View logs</a>
      </Alert>
    );

    expect(screen.getByLabelText('warning icon')).toHaveTextContent('!');
    expect(screen.getByLabelText('leading content')).toHaveTextContent('Before');
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'View logs' })).toHaveAttribute('href', '/logs');
  });

  it('applies slot class names and forwards refs to the root element', () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <Alert
        ref={ref}
        className="custom-alert"
        classNames={{
          description: 'custom-description',
          icon: 'custom-icon',
          title: 'custom-title',
          wrapper: 'custom-wrapper'
        }}
        description="Custom description"
        icon={<span aria-label="custom icon">i</span>}
        title="Custom title"
        wrapperProps={{ 'aria-label': 'alert content' }}
      />
    );

    const wrapper = screen.getByLabelText('alert content');

    expect(ref.current).toHaveAttribute('data-slot', 'alert-root');
    expect(ref.current).toHaveClass('custom-alert');
    expect(screen.getByText('Custom title')).toHaveClass('custom-title');
    expect(screen.getByText('Custom description')).toHaveClass('custom-description');
    expect(screen.getByLabelText('custom icon')).toHaveClass('custom-icon');
    expect(wrapper).toHaveClass('custom-wrapper');
  });

  it('renders body content without title or description slots', () => {
    render(
      <Alert>
        <span>Body only alert</span>
      </Alert>
    );

    const alert = screen.getByRole('alert');

    expect(alert).toHaveTextContent('Body only alert');
    expect(alert.querySelector('[data-slot="alert-title"]')).not.toBeInTheDocument();
    expect(alert.querySelector('[data-slot="alert-description"]')).not.toBeInTheDocument();
  });
});
