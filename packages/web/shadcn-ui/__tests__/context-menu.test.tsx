import { fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ContextMenu, ContextMenuCheckbox, ContextMenuRadio } from '../src/components/context-menu';
import { render, screen, setupUser, waitFor } from './helpers/render';

function openContextMenu(trigger: HTMLElement) {
  fireEvent.contextMenu(trigger);
}

describe('ContextMenu', () => {
  it('opens from the trigger and runs enabled item selection handlers', async () => {
    const user = setupUser();
    const onOpenChange = vi.fn();
    const onRename = vi.fn();
    const onDelete = vi.fn();

    render(
      <ContextMenu
        contentProps={{ 'aria-label': 'File actions menu', arrowClass: 'context-arrow', showArrow: true }}
        items={[
          { label: 'File actions', type: 'label' },
          { label: 'Rename', onSelect: onRename, shortcut: 'Enter' },
          { disabled: true, label: 'Delete', onSelect: onDelete },
          { type: 'separator' }
        ]}
        onOpenChange={onOpenChange}
      >
        <button type="button">Report.pdf</button>
      </ContextMenu>
    );

    openContextMenu(screen.getByRole('button', { name: 'Report.pdf' }));

    expect(await screen.findByRole('menu', { name: 'File actions menu' })).toBeInTheDocument();
    expect(screen.getByText('File actions')).toBeInTheDocument();
    expect(document.querySelector('.context-arrow')).toBeInTheDocument();

    const disabledItem = screen.getByRole('menuitem', { name: 'Delete' });

    expect(disabledItem).toHaveAttribute('aria-disabled', 'true');

    await user.click(disabledItem);

    expect(onDelete).not.toHaveBeenCalled();

    await user.click(screen.getByRole('menuitem', { name: /Rename/ }));

    expect(onRename).toHaveBeenCalledOnce();
    expect(onOpenChange).toHaveBeenCalledWith(true);
    await waitFor(() => {
      expect(screen.queryByRole('menu', { name: 'File actions menu' })).not.toBeInTheDocument();
    });
  });

  it('renders checkbox groups and emits the next checked value list', async () => {
    const user = setupUser();
    const onChecksChange = vi.fn();

    render(
      <ContextMenu
        items={[
          {
            checks: ['compact'],
            children: [
              { label: 'View mode', type: 'label' },
              { label: 'Compact', value: 'compact' },
              { label: 'Comfortable', value: 'comfortable' }
            ],
            onChecksChange,
            type: 'checkbox'
          }
        ]}
      >
        <button type="button">Canvas</button>
      </ContextMenu>
    );

    openContextMenu(screen.getByRole('button', { name: 'Canvas' }));

    expect(await screen.findByRole('menuitemcheckbox', { name: 'Compact' })).toBeChecked();

    const comfortableItem = screen.getByRole('menuitemcheckbox', { name: 'Comfortable' });

    expect(comfortableItem).not.toBeChecked();

    await user.click(comfortableItem);

    expect(onChecksChange).toHaveBeenLastCalledWith(['compact', 'comfortable']);
  });

  it('renders radio groups and emits the selected value', async () => {
    const user = setupUser();
    const onValueChange = vi.fn();

    render(
      <ContextMenu
        items={[
          {
            children: [
              { label: 'Sort by', type: 'label' },
              { label: 'Name', value: 'name' },
              { label: 'Updated time', value: 'updated' }
            ],
            onValueChange,
            type: 'radio',
            value: 'name'
          }
        ]}
      >
        <button type="button">Folder</button>
      </ContextMenu>
    );

    openContextMenu(screen.getByRole('button', { name: 'Folder' }));

    expect(await screen.findByRole('menuitemradio', { name: 'Name' })).toBeChecked();

    await user.click(screen.getByRole('menuitemradio', { name: 'Updated time' }));

    expect(onValueChange).toHaveBeenLastCalledWith('updated');
  });

  it('opens submenu options from the nested trigger', async () => {
    const user = setupUser();

    render(
      <ContextMenu
        items={[
          {
            children: [
              { label: 'Duplicate' },
              { label: 'Move to trash' }
            ],
            label: 'More actions',
            type: 'sub'
          }
        ]}
      >
        <button type="button">Image.png</button>
      </ContextMenu>
    );

    openContextMenu(screen.getByRole('button', { name: 'Image.png' }));

    const subTrigger = await screen.findByRole('menuitem', { name: 'More actions' });

    await user.hover(subTrigger);

    expect(await screen.findByRole('menuitem', { name: 'Duplicate' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Move to trash' })).toBeInTheDocument();
  });
});

describe('ContextMenuCheckbox', () => {
  it('renders its dedicated checkbox entry and emits checked values', async () => {
    const user = setupUser();
    const onChecksChange = vi.fn();

    render(
      <ContextMenuCheckbox
        checks={['details']}
        contentProps={{ 'aria-label': 'View options menu' }}
        items={[
          { label: 'Show details', value: 'details' },
          { label: 'Show preview', value: 'preview' }
        ]}
        onChecksChange={onChecksChange}
      >
        <button type="button">View options</button>
      </ContextMenuCheckbox>
    );

    openContextMenu(screen.getByRole('button', { name: 'View options' }));

    expect(await screen.findByRole('menu', { name: 'View options menu' })).toBeInTheDocument();
    expect(screen.getByRole('menuitemcheckbox', { name: 'Show details' })).toBeChecked();

    await user.click(screen.getByRole('menuitemcheckbox', { name: 'Show preview' }));

    expect(onChecksChange).toHaveBeenLastCalledWith(['details', 'preview']);
  });
});

describe('ContextMenuRadio', () => {
  it('renders its dedicated radio entry and emits the selected value', async () => {
    const user = setupUser();
    const onValueChange = vi.fn();

    render(
      <ContextMenuRadio
        contentProps={{ 'aria-label': 'Theme menu' }}
        items={[
          { label: 'Light', value: 'light' },
          { label: 'Dark', value: 'dark' }
        ]}
        value="light"
        onValueChange={onValueChange}
      >
        <button type="button">Theme</button>
      </ContextMenuRadio>
    );

    openContextMenu(screen.getByRole('button', { name: 'Theme' }));

    expect(await screen.findByRole('menu', { name: 'Theme menu' })).toBeInTheDocument();
    expect(screen.getByRole('menuitemradio', { name: 'Light' })).toBeChecked();

    await user.click(screen.getByRole('menuitemradio', { name: 'Dark' }));

    expect(onValueChange).toHaveBeenLastCalledWith('dark');
  });
});
