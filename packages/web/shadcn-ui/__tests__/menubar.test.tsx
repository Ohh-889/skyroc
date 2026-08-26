import { describe, expect, it, vi } from 'vitest';
import MenubarWrapper from '../src/components/menubar/Menubar';
import {
  Menubar,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarMenu,
  MenubarPortal,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarRoot,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger
} from '../src/components/menubar';
import { render, screen, setupUser, waitFor, within } from './helpers/render';

describe('Menubar', () => {
  it('opens menu triggers and runs enabled item selection handlers', async () => {
    const user = setupUser();
    const onOpen = vi.fn();
    const onDelete = vi.fn();
    const onRecent = vi.fn();

    render(
      <Menubar
        className="custom-menubar-root"
        classNames={{
          content: 'custom-menubar-content',
          item: 'custom-menubar-item',
          label: 'custom-menubar-label',
          separator: 'custom-menubar-separator',
          shortcut: 'custom-menubar-shortcut',
          subContent: 'custom-menubar-sub-content',
          trigger: 'custom-menubar-trigger'
        }}
        items={[
          {
            children: [
              { label: 'File actions', type: 'label' },
              {
                label: 'Open',
                leading: <span aria-label="open icon">O</span>,
                onSelect: onOpen,
                shortcut: ['Meta', 'O'],
                trailing: <span aria-label="open state">Ready</span>
              },
              { disabled: true, label: 'Delete', onSelect: onDelete },
              { type: 'separator' },
              {
                children: [{ label: 'Project Alpha', onSelect: onRecent }],
                label: 'Recent',
                type: 'sub'
              }
            ],
            label: 'File',
            shortcut: 'F'
          }
        ]}
      />
    );

    expect(screen.getByRole('menubar')).toHaveClass('custom-menubar-root');

    const fileTrigger = screen.getByRole('menuitem', { name: /File/ });

    expect(fileTrigger).toHaveClass('custom-menubar-trigger');

    await user.click(fileTrigger);

    const menu = await screen.findByRole('menu');

    expect(menu).toHaveClass('custom-menubar-content');
    expect(screen.getByText('File actions')).toHaveClass('custom-menubar-label');
    expect(screen.getByLabelText('open icon')).toHaveTextContent('O');
    expect(screen.getByLabelText('open state')).toHaveTextContent('Ready');
    expect(document.querySelector('.custom-menubar-separator')).toBeInTheDocument();
    expect(document.querySelector('.custom-menubar-shortcut')).toBeInTheDocument();

    const disabledItem = screen.getByRole('menuitem', { name: 'Delete' });

    expect(disabledItem).toHaveAttribute('aria-disabled', 'true');

    await user.click(disabledItem);

    expect(onDelete).not.toHaveBeenCalled();

    await user.hover(screen.getByRole('menuitem', { name: 'Recent' }));

    expect(await screen.findByRole('menuitem', { name: 'Project Alpha' })).toBeInTheDocument();

    await user.click(screen.getByRole('menuitem', { name: /Open/ }));

    expect(onOpen).toHaveBeenCalledOnce();
    expect(onRecent).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });

  it('renders checkbox menus and emits the next checked value list', async () => {
    const user = setupUser();
    const onChecksChange = vi.fn();

    render(
      <Menubar
        items={[
          {
            checks: ['sidebar'],
            children: [
              { label: 'Layout', type: 'label' },
              { label: 'Sidebar', value: 'sidebar' },
              { type: 'separator' },
              { label: 'Preview', value: 'preview' }
            ],
            label: 'View',
            onChecksChange,
            type: 'checkbox'
          }
        ]}
      />
    );

    await user.click(screen.getByRole('menuitem', { name: 'View' }));

    expect(await screen.findByRole('menuitemcheckbox', { name: 'Sidebar' })).toBeChecked();

    await user.click(screen.getByRole('menuitemcheckbox', { name: 'Preview' }));

    expect(onChecksChange).toHaveBeenLastCalledWith(['sidebar', 'preview']);
  });

  it('renders radio menus and emits the selected value', async () => {
    const user = setupUser();
    const onValueChange = vi.fn();

    render(
      <Menubar
        items={[
          {
            children: [
              { label: 'Theme mode', type: 'label' },
              { label: 'Light', value: 'light' },
              { type: 'separator' },
              { label: 'Dark', value: 'dark' }
            ],
            label: 'Theme',
            onValueChange,
            type: 'radio',
            value: 'light'
          }
        ]}
      />
    );

    await user.click(screen.getByRole('menuitem', { name: 'Theme' }));

    expect(await screen.findByRole('menuitemradio', { name: 'Light' })).toBeChecked();

    await user.click(screen.getByRole('menuitemradio', { name: 'Dark' }));

    expect(onValueChange).toHaveBeenLastCalledWith('dark');
  });

  it('renders through the wrapper entry and supports menus without options', async () => {
    const user = setupUser();

    render(
      <MenubarWrapper
        items={[
          {
            children: [],
            label: 'Empty'
          }
        ]}
      />
    );

    await user.click(screen.getByRole('menuitem', { name: 'Empty' }));

    const menu = await screen.findByRole('menu');

    expect(within(menu).queryByRole('menuitem')).not.toBeInTheDocument();
  });

  it('renders composable primitives for shadcn style usage', async () => {
    const user = setupUser();

    render(
      <>
        <MenubarRoot>
          <MenubarMenu>
            <MenubarTrigger
              leading="Prefix "
              shortcut="T"
            >
              Tools
            </MenubarTrigger>

            <MenubarContent
              className="primitive-menubar-content"
              sideOffset={4}
            >
              <MenubarGroup data-testid="primitive-menubar-group">
                <MenubarItem inset>Build</MenubarItem>
                <MenubarSub>
                  <MenubarSubTrigger>Advanced</MenubarSubTrigger>
                  <MenubarSubContent className="primitive-menubar-sub-content">
                    <MenubarItem>Inspect</MenubarItem>
                  </MenubarSubContent>
                </MenubarSub>
                <MenubarRadioGroup value="preview">
                  <MenubarRadioItem value="preview">Preview</MenubarRadioItem>
                </MenubarRadioGroup>
              </MenubarGroup>
            </MenubarContent>

            <MenubarPortal forceMount>
              <span data-testid="menubar-portal-child">Portal child</span>
            </MenubarPortal>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger leading={<span data-testid="tools-leading-icon">I</span>}>
              Inspectors
            </MenubarTrigger>
            <MenubarContent>
              <MenubarItem>Elements</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </MenubarRoot>

        <MenubarShortcut className="primitive-menubar-shortcut">Meta</MenubarShortcut>
        <MenubarShortcut>
          <span>Ignored shortcut</span>
        </MenubarShortcut>
      </>
    );

    await user.click(screen.getByRole('menuitem', { name: /Prefix Tools/ }));

    expect(screen.getByTestId('tools-leading-icon')).toHaveClass('text-muted-foreground');
    expect(await screen.findByRole('menu')).toHaveClass('primitive-menubar-content');
    expect(screen.getByTestId('primitive-menubar-group')).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Build' })).toHaveClass('pl-8');
    expect(screen.getByRole('menuitemradio', { name: 'Preview' })).toBeChecked();
    expect(screen.getByTestId('menubar-portal-child')).toHaveTextContent('Portal child');
    expect(document.querySelector('.primitive-menubar-shortcut')).toHaveTextContent('META');

    await user.hover(screen.getByRole('menuitem', { name: 'Advanced' }));

    expect(await screen.findByRole('menuitem', { name: 'Inspect' })).toBeInTheDocument();
    expect(document.querySelector('.primitive-menubar-sub-content')).toBeInTheDocument();
  });
});
