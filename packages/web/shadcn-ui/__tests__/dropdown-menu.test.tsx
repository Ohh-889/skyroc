import { describe, expect, it, vi } from 'vitest';
import { DropdownMenu } from '../src/preset/dropdown-menu';
import {
  DropdownMenuCheckbox,
  DropdownMenuRadio
} from '../src/components/dropdown-menu';
import { render, screen, setupUser, waitFor } from './helpers/render';

describe('DropdownMenu', () => {
  it('opens from the trigger and runs item selection handlers', async () => {
    const user = setupUser();
    const onEdit = vi.fn();
    const onArchive = vi.fn();

    render(
      <DropdownMenu
        className="custom-dropdown-content"
        classNames={{
          arrow: 'custom-dropdown-arrow',
          content: 'configured-dropdown-content',
          item: 'custom-dropdown-item',
          label: 'custom-dropdown-label',
          separator: 'custom-dropdown-separator',
          shortcut: 'custom-dropdown-shortcut',
          subContent: 'custom-dropdown-sub-content'
        }}
        contentProps={{
          'aria-label': 'Actions menu',
          showArrow: true
        }}
        items={[
          { label: 'File actions', type: 'label' },
          {
            label: 'Edit',
            leading: <span aria-label="edit icon">E</span>,
            onSelect: onEdit,
            shortcut: ['Meta', 'E'],
            trailing: <span aria-label="edit hint">Ready</span>
          },
          { disabled: true, label: 'Delete' },
          { type: 'separator' },
          {
            children: [
              { label: 'Archive', onSelect: onArchive },
              { label: 'Duplicate' }
            ],
            leading: <span aria-hidden="true">M</span>,
            label: 'More actions',
            type: 'sub'
          },
          {
            children: [
              { label: 'Inspect' }
            ],
            label: 'More details',
            type: 'sub'
          }
        ]}
      >
        <button type="button">Actions</button>
      </DropdownMenu>
    );

    await user.click(screen.getByRole('button', { name: 'Actions' }));

    const menu = await screen.findByRole('menu');

    expect(menu).toHaveAttribute('aria-label', 'Actions menu');
    expect(menu).toHaveClass('custom-dropdown-content');
    expect(menu).not.toHaveClass('configured-dropdown-content');
    expect(screen.getByText('File actions')).toHaveClass('custom-dropdown-label');
    expect(screen.getByLabelText('edit icon')).toHaveTextContent('E');
    expect(screen.getByLabelText('edit hint')).toHaveTextContent('Ready');
    expect(document.querySelector('.custom-dropdown-arrow')).toBeInTheDocument();
    expect(document.querySelector('.custom-dropdown-separator')).toBeInTheDocument();
    expect(document.querySelector('.custom-dropdown-shortcut')).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveAttribute('aria-disabled', 'true');

    await user.hover(screen.getByRole('menuitem', { name: 'More actions' }));

    expect(await screen.findByRole('menuitem', { name: 'Archive' })).toBeInTheDocument();

    await user.click(screen.getByRole('menuitem', { name: /Edit/ }));

    expect(onEdit).toHaveBeenCalledOnce();
    expect(onArchive).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });

  it('renders checkbox groups and emits checked values', async () => {
    const user = setupUser();
    const onChecksChange = vi.fn();

    render(
      <DropdownMenu
        items={[
          {
            checks: ['compact'],
            children: [
              {
                label: 'View mode',
                leading: <span aria-label="view mode leading">V</span>,
                type: 'label'
              },
              {
                indicatorIcon: <span aria-label="compact indicator">Selected</span>,
                label: 'Compact',
                leading: <span aria-hidden="true">C</span>,
                shortcut: 'C',
                value: 'compact'
              },
              { type: 'separator' },
              { label: 'Comfortable', value: 'comfortable' },
              { label: 'Default column' }
            ],
            onChecksChange,
            type: 'checkbox'
          }
        ]}
      >
        <button type="button">View</button>
      </DropdownMenu>
    );

    await user.click(screen.getByRole('button', { name: 'View' }));

    expect(await screen.findByRole('menuitemcheckbox', { name: /Compact/ })).toBeChecked();
    expect(screen.getByLabelText('view mode leading')).toHaveTextContent('V');
    expect(screen.getByLabelText('compact indicator')).toHaveTextContent('Selected');

    await user.click(screen.getByRole('menuitemcheckbox', { name: 'Comfortable' }));

    expect(onChecksChange).toHaveBeenLastCalledWith(['compact', 'comfortable']);

    await user.click(screen.getByRole('button', { name: 'View' }));
    await user.click(await screen.findByRole('menuitemcheckbox', { name: /Compact/ }));

    expect(onChecksChange).toHaveBeenLastCalledWith([]);
  });

  it('handles checkbox groups without controlled checked values', async () => {
    const user = setupUser();
    const onChecksChange = vi.fn();

    render(
      <DropdownMenu
        items={[
          {
            children: [
              { checked: true, label: 'Pinned', value: 'pinned' },
              { label: 'Updates', value: 'updates' },
              { label: 'No value' }
            ],
            onChecksChange,
            type: 'checkbox'
          }
        ]}
      >
        <button type="button">Columns</button>
      </DropdownMenu>
    );

    await user.click(screen.getByRole('button', { name: 'Columns' }));

    expect(await screen.findByRole('menuitemcheckbox', { name: 'Pinned' })).toBeChecked();

    await user.click(screen.getByRole('menuitemcheckbox', { name: 'Updates' }));

    expect(onChecksChange).toHaveBeenLastCalledWith(['updates']);

    await user.click(screen.getByRole('button', { name: 'Columns' }));
    await user.click(await screen.findByRole('menuitemcheckbox', { name: 'Pinned' }));

    expect(onChecksChange).toHaveBeenLastCalledWith([]);

    await user.click(screen.getByRole('button', { name: 'Columns' }));
    await user.click(await screen.findByRole('menuitemcheckbox', { name: 'No value' }));

    expect(onChecksChange).toHaveBeenLastCalledWith(['']);
  });

  it('renders radio groups and emits the selected value', async () => {
    const user = setupUser();
    const onValueChange = vi.fn();

    render(
      <DropdownMenu
        items={[
          {
            children: [
              { label: 'Sort by', type: 'label' },
              {
                indicatorIcon: <span aria-label="name radio indicator">Selected</span>,
                label: 'Name',
                leading: <span aria-hidden="true">N</span>,
                shortcut: 'N',
                value: 'name'
              },
              { type: 'separator' },
              { label: 'Updated', value: 'updated' }
            ],
            onValueChange,
            type: 'radio',
            value: 'name'
          }
        ]}
      >
        <button type="button">Sort</button>
      </DropdownMenu>
    );

    await user.click(screen.getByRole('button', { name: 'Sort' }));

    expect(await screen.findByRole('menuitemradio', { name: /Name/ })).toBeChecked();
    expect(screen.getByLabelText('name radio indicator')).toHaveTextContent('Selected');

    await user.click(screen.getByRole('menuitemradio', { name: 'Updated' }));

    expect(onValueChange).toHaveBeenLastCalledWith('updated');
  });
});

describe('DropdownMenuCheckbox', () => {
  it('renders its dedicated checkbox wrapper and emits checked values', async () => {
    const user = setupUser();
    const onChecksChange = vi.fn();

    render(
      <DropdownMenuCheckbox
        checks={['preview']}
        contentProps={{ 'aria-label': 'Preview menu' }}
        items={[
          { label: 'Preview', value: 'preview' },
          { label: 'Details', value: 'details' }
        ]}
        onChecksChange={onChecksChange}
      >
        <button type="button">Columns</button>
      </DropdownMenuCheckbox>
    );

    await user.click(screen.getByRole('button', { name: 'Columns' }));

    expect(await screen.findByRole('menu')).toHaveAttribute('aria-label', 'Preview menu');
    expect(screen.getByRole('menuitemcheckbox', { name: 'Preview' })).toBeChecked();

    await user.click(screen.getByRole('menuitemcheckbox', { name: 'Details' }));

    expect(onChecksChange).toHaveBeenLastCalledWith(['preview', 'details']);
  });
});

describe('DropdownMenuRadio', () => {
  it('renders its dedicated radio wrapper and emits selected values', async () => {
    const user = setupUser();
    const onValueChange = vi.fn();

    render(
      <DropdownMenuRadio
        contentProps={{ 'aria-label': 'Density menu' }}
        items={[
          { label: 'Compact', value: 'compact' },
          { label: 'Comfortable', value: 'comfortable' }
        ]}
        value="compact"
        onValueChange={onValueChange}
      >
        <button type="button">Density</button>
      </DropdownMenuRadio>
    );

    await user.click(screen.getByRole('button', { name: 'Density' }));

    expect(await screen.findByRole('menu')).toHaveAttribute('aria-label', 'Density menu');
    expect(screen.getByRole('menuitemradio', { name: 'Compact' })).toBeChecked();

    await user.click(screen.getByRole('menuitemradio', { name: 'Comfortable' }));

    expect(onValueChange).toHaveBeenLastCalledWith('comfortable');
  });
});
