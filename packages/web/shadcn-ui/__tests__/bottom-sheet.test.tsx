import { fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { BottomSheet } from '../src/preset/bottom-sheet';
import { render, screen, waitFor } from './helpers/render';

describe('BottomSheet', () => {
  it('opens from the trigger and renders title, description, content, footer and close action', async () => {
    const onOpenChange = vi.fn();

    render(
      <BottomSheet
        showClose
        classNames={{
          close: 'custom-close',
          content: 'custom-sheet-content',
          contentBody: 'custom-content-body',
          description: 'custom-description',
          footer: 'custom-footer',
          header: 'custom-header',
          knob: 'custom-knob',
          overlay: 'custom-overlay',
          title: 'custom-title'
        }}
        closeProps={{ children: <button type="button">Close sheet</button> }}
        description="Choose the next action."
        footer={<button type="button">Apply</button>}
        title="Sheet actions"
        trigger={<button type="button">Open sheet</button>}
        onOpenChange={onOpenChange}
      >
        <p>Sheet body</p>
      </BottomSheet>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Open sheet' }));

    const dialog = await screen.findByRole('dialog');

    expect(dialog).toHaveAttribute('data-slot', 'bottom-sheet-content');
    expect(dialog).toHaveClass('custom-sheet-content');
    expect(screen.getByText('Sheet actions')).toHaveClass('custom-title');
    expect(screen.getByText('Choose the next action.')).toHaveClass('custom-description');
    expect(screen.getByText('Sheet body').parentElement).toHaveClass('custom-content-body');
    expect(screen.getByRole('button', { name: 'Apply' }).parentElement).toHaveClass('custom-footer');

    fireEvent.click(screen.getByRole('button', { name: 'Close sheet' }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
    await waitFor(() => {
      expect(dialog).toHaveAttribute('data-state', 'closed');
    });
  });

  it('can render without close button and footer', async () => {
    render(
      <BottomSheet
        description="Read-only details."
        title="Details"
        trigger={<button type="button">Open details</button>}
      >
        Read-only content
      </BottomSheet>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Open details' }));

    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Read-only content')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Close sheet' })).not.toBeInTheDocument();
  });

  it('uses the default footer layout class when no footer class name is configured', async () => {
    render(
      <BottomSheet
        description="Default footer description."
        footer={<button type="button">Confirm</button>}
        title="Default footer"
        trigger={<button type="button">Open default footer sheet</button>}
      >
        Default footer content
      </BottomSheet>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Open default footer sheet' }));

    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Confirm' }).parentElement).toHaveClass('flex-col-reverse!');
  });
});
