import { describe, expect, it, vi } from 'vitest';
import { AlertDialog } from '../src/preset/alert-dialog';
import { render, screen, setupUser, waitFor } from './helpers/render';

describe('AlertDialog', () => {
  it('opens from the trigger and runs cancel or OK actions', async () => {
    const user = setupUser();
    const onCancel = vi.fn();
    const onOk = vi.fn();

    render(
      <AlertDialog
        cancelText="Keep"
        description="This action cannot be undone."
        okText="Delete"
        title="Delete project"
        trigger={<button type="button">Open alert</button>}
        type="destructive"
        onCancel={onCancel}
        onOk={onOk}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Open alert' }));

    expect(await screen.findByRole('alertdialog')).toBeInTheDocument();
    expect(screen.getByText('Delete project')).toBeInTheDocument();
    expect(screen.getByText('This action cannot be undone.')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Keep' }));

    expect(onCancel).toHaveBeenCalledOnce();
    await waitFor(() => {
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Open alert' }));
    expect(await screen.findByRole('alertdialog')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Delete' }));

    expect(onOk).toHaveBeenCalledOnce();
    await waitFor(() => {
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    });
  });

  it('can hide the cancel action while keeping the OK action', async () => {
    const user = setupUser();
    const onOk = vi.fn();

    render(
      <AlertDialog
        showCancel={false}
        description="Only the primary action is available."
        okText="Continue"
        title="Continue setup"
        trigger={<button type="button">Open primary alert</button>}
        onOk={onOk}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Open primary alert' }));

    expect(await screen.findByRole('alertdialog')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Cancel' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Continue' }));

    expect(onOk).toHaveBeenCalledOnce();
    await waitFor(() => {
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    });
  });

  it('supports custom footer content and slot class names', async () => {
    const user = setupUser();
    const onCustomAction = vi.fn();

    render(
      <AlertDialog
        classNames={{
          content: 'custom-content',
          description: 'custom-description',
          footer: 'custom-footer',
          header: 'custom-header',
          title: 'custom-title'
        }}
        description="Custom footer description."
        footer={<button type="button" onClick={onCustomAction}>Archive</button>}
        title="Archive record"
        trigger={<button type="button">Open custom alert</button>}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Open custom alert' }));

    const dialog = await screen.findByRole('alertdialog');

    expect(dialog).toHaveClass('custom-content');
    expect(screen.getByText('Archive record')).toHaveClass('custom-title');
    expect(screen.getByText('Custom footer description.')).toHaveClass('custom-description');
    expect(screen.getByRole('button', { name: 'Archive' }).parentElement).toHaveClass('custom-footer');

    await user.click(screen.getByRole('button', { name: 'Archive' }));

    expect(onCustomAction).toHaveBeenCalledOnce();
  });
});
