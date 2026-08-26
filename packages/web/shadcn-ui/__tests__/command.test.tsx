import { describe, expect, it, vi } from 'vitest';
import {
  Command,
  CommandDialog,
  CommandGroup,
  CommandItem,
  CommandRoot,
  CommandShortcut
} from '../src/preset/command';
import { render, screen, setupUser } from './helpers/render';

vi.mock('@iconify/react', () => ({
  Icon: (props: { className?: string; icon: string }) => (
    <span
      aria-label={props.icon}
      className={props.className}
      data-testid="iconify-icon"
    />
  )
}));

describe('Command', () => {
  it('renders grouped items, separators, shortcuts, leading and trailing content', async () => {
    const user = setupUser();
    const onCreate = vi.fn();

    render(
      <Command
        className="custom-command-root"
        classNames={{
          empty: 'custom-empty',
          group: 'custom-group',
          groupLabel: 'custom-group-label',
          input: 'custom-input',
          inputIcon: 'custom-input-icon',
          inputWrapper: 'custom-input-wrapper',
          item: 'custom-command-item',
          list: 'custom-list',
          separator: 'custom-separator'
        }}
        empty="Nothing matched."
        inputProps={{ placeholder: 'Search commands' }}
        items={[
          {
            children: [
              {
                label: 'Create file',
                leading: <span aria-label="create icon">+</span>,
                onSelect: onCreate,
                shortcut: ['Meta', 'N'],
                trailing: <span aria-label="create trailing">Ready</span>,
                value: 'create-file'
              },
              { type: 'separator' },
              {
                label: 'Open file',
                leading: 'O',
                value: 'open-file'
              }
            ],
            label: 'Files'
          },
          { type: 'separator' },
          {
            label: 'Settings',
            shortcut: 'Ctrl+S',
            value: 'settings'
          }
        ]}
      />
    );

    const input = screen.getByPlaceholderText('Search commands');

    expect(input.closest('[data-slot="command-root"]')).toHaveClass('custom-command-root');
    expect(input).toHaveClass('custom-input');
    expect(input.parentElement).toHaveClass('custom-input-wrapper');
    expect(screen.getByTestId('iconify-icon')).toHaveClass('custom-input-icon');
    expect(screen.getByText('Files')).toHaveClass('custom-group-label');
    expect(screen.getByText('Files').closest('[data-slot="command-group"]')).toHaveClass('custom-group');
    expect(screen.getByText('Create file')).toHaveClass('custom-command-item');
    expect(screen.getByLabelText('create icon')).toHaveTextContent('+');
    expect(screen.getByLabelText('create trailing')).toHaveTextContent('Ready');
    expect(document.querySelectorAll('[data-slot="command-separator"]')).toHaveLength(2);
    expect(document.querySelector('[data-slot="command-shortcut"]')).toBeInTheDocument();

    await user.click(screen.getByText('Create file'));

    expect(onCreate).toHaveBeenCalledOnce();

    await user.type(input, 'missing');

    expect(screen.getByText('Nothing matched.')).toHaveClass('custom-empty');
  });

  it('supports custom input leading and trailing content', () => {
    render(
      <Command
        inputProps={{
          leading: <span aria-label="custom leading">Lead</span>,
          placeholder: 'Search with custom chrome',
          trailing: <button type="button">Clear</button>
        }}
        items={[]}
      />
    );

    expect(screen.getByLabelText('custom leading')).toHaveTextContent('Lead');
    expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument();
    expect(screen.queryByTestId('iconify-icon')).not.toBeInTheDocument();
  });

  it('renders groups without heading labels', () => {
    render(
      <CommandRoot>
        <CommandGroup classNames={{ group: 'group-without-heading' }}>
          <CommandItem value="loose-command">Loose command</CommandItem>
        </CommandGroup>
      </CommandRoot>
    );

    expect(screen.getByText('Loose command')).toHaveAttribute('data-slot', 'command-item');
    expect(screen.getByText('Loose command').closest('[data-slot="command-group"]')).toHaveClass(
      'group-without-heading'
    );
  });

  it('renders command dialog content with dialog slot class names', () => {
    render(
      <CommandDialog
        defaultOpen
        className="custom-dialog-content"
        classNames={{
          close: 'custom-dialog-close',
          description: 'custom-dialog-description',
          header: 'custom-dialog-header',
          overlay: 'custom-dialog-overlay',
          title: 'custom-dialog-title'
        }}
        description="Run a command from the palette."
        title="Command palette"
      >
        <CommandRoot>
          Dialog command body
        </CommandRoot>
      </CommandDialog>
    );

    expect(screen.getByRole('dialog')).toHaveClass('custom-dialog-content');
    expect(screen.getByText('Command palette')).toHaveClass('custom-dialog-title');
    expect(screen.getByText('Run a command from the palette.')).toHaveClass('custom-dialog-description');
    expect(document.querySelector('[data-slot="dialog-close"]')).toHaveClass('custom-dialog-close');
    expect(screen.getByText('Dialog command body')).toHaveAttribute('data-slot', 'command-root');
  });

  it('uses configured command dialog content class name when className is omitted', () => {
    render(
      <CommandDialog
        defaultOpen
        classNames={{ content: 'configured-dialog-content' }}
        description="Configured dialog description."
        title="Configured command palette"
      >
        <CommandRoot>
          Configured dialog body
        </CommandRoot>
      </CommandDialog>
    );

    expect(screen.getByRole('dialog')).toHaveClass('configured-dialog-content');
    expect(screen.getByText('Configured dialog body')).toHaveAttribute('data-slot', 'command-root');
  });

  it('renders custom shortcut children directly', () => {
    render(<CommandShortcut>Custom shortcut</CommandShortcut>);

    expect(screen.getByText('Custom shortcut')).toHaveAttribute('data-slot', 'command-shortcut');
  });
});
