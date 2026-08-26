import { describe, expect, it } from 'vitest';
import {
  NavigationMenu,
  NavigationMenuChildLink,
  NavigationMenuChildList,
  NavigationMenuChildListItem,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuRoot,
  NavigationMenuTrigger,
  NavigationMenuViewport
} from '../src/components/navigation-menu';
import NavigationMenuWrapper from '../src/components/navigation-menu/NavigationMenu';
import { render, screen, setupUser, waitFor, within } from './helpers/render';

describe('NavigationMenu', () => {
  it('renders configured links, submenu items and custom slot classes', async () => {
    const user = setupUser();

    render(
      <NavigationMenu
        aria-label="Main navigation"
        className="custom-navigation-root"
        classNames={{
          arrow: 'custom-navigation-arrow',
          content: 'custom-navigation-content',
          item: 'custom-navigation-item',
          itemIcon: 'custom-navigation-item-icon',
          link: 'custom-navigation-link',
          linkIcon: 'custom-navigation-link-icon',
          list: 'custom-navigation-list',
          subItem: 'custom-navigation-sub-item',
          subLink: 'custom-navigation-sub-link',
          subLinkContent: 'custom-navigation-sub-link-content',
          subLinkDescription: 'custom-navigation-sub-link-description',
          subLinkLabel: 'custom-navigation-sub-link-label',
          subList: 'custom-navigation-sub-list',
          trigger: 'custom-navigation-trigger',
          triggerIcon: 'custom-navigation-trigger-icon',
          viewport: 'custom-navigation-viewport',
          viewportRoot: 'custom-navigation-viewport-root'
        }}
        defaultValue="products"
        items={[
          {
            href: '/docs',
            label: 'Docs',
            leading: <span aria-label="docs icon">D</span>,
            trailing: <span aria-label="docs trailing">Open docs</span>,
            type: 'link'
          },
          {
            children: [
              {
                description: 'Use ready-made UI blocks.',
                href: '/products/components',
                label: 'Components',
                leading: <span aria-label="components icon">C</span>
              },
              {
                disabled: true,
                href: '/products/templates',
                label: 'Templates',
                trailing: <span aria-label="templates trailing">Soon</span>
              }
            ],
            label: 'Products',
            value: 'products'
          }
        ]}
        size="lg"
      />
    );

    const navigation = screen.getByRole('navigation', { name: 'Main navigation' });

    expect(navigation).toHaveClass('custom-navigation-root');
    expect(screen.getByRole('list')).toHaveClass('custom-navigation-list');
    expect(screen.getAllByRole('listitem')[0]).toHaveClass('custom-navigation-item');
    expect(screen.getByRole('link', { name: /Docs/ })).toHaveAttribute('href', '/docs');
    expect(screen.getByRole('link', { name: /Docs/ })).toHaveClass('custom-navigation-link');
    expect(screen.getByLabelText('docs icon')).toHaveClass('custom-navigation-item-icon');
    expect(screen.getByLabelText('docs trailing')).toHaveTextContent('Open docs');

    const productsTrigger = screen.getByRole('button', { name: 'Products' });

    expect(productsTrigger).toHaveClass('custom-navigation-trigger');

    await user.hover(productsTrigger);

    await waitFor(() => {
      expect(productsTrigger).toHaveAttribute('data-state', 'open');
    });

    const childList = document.querySelector('[data-slot="navigation-menu-child-list"]');

    expect(childList).toHaveClass('custom-navigation-sub-list');
    expect(screen.getByRole('link', { name: /Components/ })).toHaveAttribute('href', '/products/components');
    expect(screen.getByRole('link', { name: /Components/ })).toHaveClass('custom-navigation-sub-link');
    expect(screen.getByText('Components')).toHaveClass('custom-navigation-sub-link-label');
    expect(screen.getByText('Use ready-made UI blocks.')).toHaveClass('custom-navigation-sub-link-description');
    expect(screen.getByLabelText('components icon')).toHaveClass('custom-navigation-item-icon');
    expect(screen.getByRole('link', { name: /Templates/ })).toHaveAttribute('data-disabled', '');
    expect(screen.getByLabelText('templates trailing')).toHaveTextContent('Soon');
    expect(document.querySelector('[data-slot="navigation-menu-content"]')).toHaveClass('custom-navigation-content');
    expect(document.querySelector('[data-slot="navigation-menu-viewport"]')).toHaveClass('custom-navigation-viewport');
    expect(document.querySelector('[data-slot="navigation-menu-viewport-root"]')).toHaveClass(
      'custom-navigation-viewport-root'
    );
  });

  it('treats items without children as standalone links and supports empty submenu content', async () => {
    const user = setupUser();

    render(
      <NavigationMenu
        items={[
          {
            href: '/pricing',
            label: 'Pricing'
          },
          {
            children: [],
            label: 'Resources',
            value: 'resources'
          }
        ]}
      />
    );

    expect(screen.getByRole('link', { name: /Pricing/ })).toHaveAttribute('href', '/pricing');

    await user.hover(screen.getByRole('button', { name: 'Resources' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Resources' })).toHaveAttribute('data-state', 'open');
    });

    const submenu = document.querySelector('[data-slot="navigation-menu-child-list"]');

    expect(submenu).toBeInTheDocument();
    expect(within(submenu as HTMLElement).queryByRole('link')).not.toBeInTheDocument();
  });

  it('renders through the wrapper entry and supports disabled top-level links', () => {
    render(
      <NavigationMenuWrapper
        aria-label="Wrapper navigation"
        items={[
          {
            disabled: true,
            href: '/disabled-docs',
            label: 'Disabled docs',
            type: 'link'
          },
          {
            href: '/guide',
            label: 'Guide',
            type: 'link'
          }
        ]}
      />
    );

    const disabledLink = screen.getByRole('link', { name: /Disabled docs/ });
    const guideLink = screen.getByRole('link', { name: /Guide/ });

    expect(screen.getByRole('navigation', { name: 'Wrapper navigation' })).toBeInTheDocument();
    expect(disabledLink).toHaveAttribute('href', '/disabled-docs');
    expect(disabledLink).toHaveAttribute('data-disabled', '');
    expect(guideLink).not.toHaveAttribute('data-disabled');
    expect(guideLink.querySelector('svg')).toHaveClass('lucide-arrow-up-right');
  });

  it('renders composable primitives for shadcn style usage', async () => {
    const user = setupUser();

    render(
      <NavigationMenuRoot
        aria-label="Primitive navigation"
        className="primitive-navigation-root"
        defaultValue="library"
      >
        <NavigationMenuList className="primitive-navigation-list">
          <NavigationMenuItem className="primitive-navigation-item">
            <NavigationMenuLink
              className="primitive-navigation-link"
              href="/home"
              leading={<span aria-label="home icon">H</span>}
            >
              Home
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger
              className="primitive-navigation-trigger"
              value="library"
            >
              Library
            </NavigationMenuTrigger>
            <NavigationMenuContent className="primitive-navigation-content">
              <NavigationMenuChildList className="primitive-navigation-child-list">
                <NavigationMenuChildListItem className="primitive-navigation-child-item">
                  <NavigationMenuChildLink
                    className="primitive-navigation-child-link"
                    description="Component references"
                    href="/library/components"
                  >
                    Components
                  </NavigationMenuChildLink>
                </NavigationMenuChildListItem>
              </NavigationMenuChildList>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>

        <NavigationMenuIndicator className="primitive-navigation-indicator" />
        <NavigationMenuViewport className="primitive-navigation-viewport" />
      </NavigationMenuRoot>
    );

    expect(screen.getByRole('navigation', { name: 'Primitive navigation' })).toHaveClass('primitive-navigation-root');
    expect(screen.getByRole('link', { name: /Home/ })).toHaveAttribute('data-slot', 'navigation-menu-link');
    expect(screen.getByRole('link', { name: /Home/ })).toHaveClass('primitive-navigation-link');
    expect(screen.getByLabelText('home icon')).toBeInTheDocument();

    await user.hover(screen.getByRole('button', { name: 'Library' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Library' })).toHaveAttribute('data-state', 'open');
    });

    expect(document.querySelector('[data-slot="navigation-menu-content"]')).toHaveClass('primitive-navigation-content');
    expect(screen.getByRole('link', { name: /Components/ })).toHaveClass('primitive-navigation-child-link');
    expect(screen.getByText('Component references')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="navigation-menu-viewport"]')).toHaveClass(
      'primitive-navigation-viewport'
    );
  });
});
