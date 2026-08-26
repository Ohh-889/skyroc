import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Dialog } from '../src/preset/dialog';

vi.mock('@iconify/react', () => ({
  Icon: (props: { icon: string }) => <span data-icon={props.icon} data-testid="iconify-icon" />
}));

describe('Dialog', () => {
  it('opens from the trigger and renders accessible content', async () => {
    render(
      <Dialog
        closeProps={{ children: <button type="button">Close dialog</button> }}
        description="This action cannot be undone."
        footer={null}
        title="Delete project"
        trigger={<button type="button">Open dialog</button>}
      >
        <p>Project details</p>
      </Dialog>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Open dialog' }));

    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Delete project')).toBeInTheDocument();
    expect(screen.getByText('This action cannot be undone.')).toBeInTheDocument();
    expect(screen.getByText('Project details')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'OK' })).not.toBeInTheDocument();
  });

  it('omits the description node when description is not provided', async () => {
    render(
      <Dialog
        contentProps={{ 'aria-describedby': undefined }}
        footer={false}
        title="Create project"
        trigger={<button type="button">Open create dialog</button>}
      >
        <p>Create body</p>
      </Dialog>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Open create dialog' }));

    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Create body')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="dialog-close"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="dialog-description"]')).not.toBeInTheDocument();
  });

  it('runs the OK handler and closes through dialog actions', async () => {
    const onOk = vi.fn();

    render(
      <Dialog
        closeProps={{ children: <button type="button">Close dialog</button> }}
        description="Confirm details."
        okText="Confirm"
        title="Confirm action"
        trigger={<button type="button">Open dialog</button>}
        onOk={onOk}
      >
        <p>Confirm body</p>
      </Dialog>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Open dialog' }));

    expect(await screen.findByRole('dialog')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));

    expect(onOk).toHaveBeenCalledOnce();
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Open dialog' }));
    expect(await screen.findByRole('dialog')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Close dialog' }));

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
});
