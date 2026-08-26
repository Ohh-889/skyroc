import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Breadcrumb } from '../src/preset/breadcrumb';
import { render, screen, setupUser } from './helpers/render';

const items = [
  { href: '/', label: 'Home', value: 'home' },
  { href: '/components', label: 'Components', value: 'components' },
  { href: '/components/forms', label: 'Forms', value: 'forms' },
  { href: '/components/forms/input', label: 'Input', value: 'input' },
  { label: 'Current', value: 'current' }
];

describe('Breadcrumb', () => {
  it('renders links, the current page, separators and handles item clicks', async () => {
    const user = setupUser();
    const ref = createRef<HTMLElement>();
    const handleItemClick = vi.fn();

    render(
      <Breadcrumb
        ref={ref}
        className="custom-root"
        classNames={{
          item: 'custom-item',
          list: 'custom-list',
          root: 'configured-root',
          separator: 'custom-separator'
        }}
        handleItemClick={handleItemClick}
        items={[
          { href: '/', label: 'Home', leading: <span aria-label="home icon">H</span>, value: 'home' },
          { label: 'Current', trailing: <span aria-label="current marker">*</span>, value: 'current' }
        ]}
        pageProps={{ className: 'custom-page' }}
        separator={<span aria-hidden="true">/</span>}
      />
    );

    const navigation = screen.getByRole('navigation', { name: 'breadcrumb' });
    const home = screen.getByRole('link', { name: /Home/ });
    const current = screen.getByRole('link', { name: /Current/ });

    expect(ref.current).toBe(navigation);
    expect(navigation).toHaveAttribute('data-slot', 'breadcrumb-root');
    expect(navigation).toHaveClass('custom-root');
    expect(navigation).not.toHaveClass('configured-root');
    expect(home).toHaveAttribute('href', '/');
    expect(current).toHaveAttribute('aria-current', 'page');
    expect(current).toHaveClass('custom-page');
    expect(screen.getByLabelText('home icon')).toHaveTextContent('H');
    expect(screen.getByLabelText('current marker')).toHaveTextContent('*');

    await user.click(home);

    expect(handleItemClick).toHaveBeenCalledWith(expect.objectContaining({ value: 'home' }));
  });

  it('collapses middle items into an ellipsis dropdown', async () => {
    const user = setupUser();
    const handleItemClick = vi.fn();

    render(
      <Breadcrumb
        ellipsis
        ellipsisProps={{ 'aria-label': 'More breadcrumb items' }}
        handleItemClick={handleItemClick}
        items={items}
      />
    );

    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Components' })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Input' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Current' })).toBeInTheDocument();

    await user.click(screen.getByLabelText('More breadcrumb items'));
    await user.click(await screen.findByRole('menuitem', { name: 'Components' }));

    expect(handleItemClick).toHaveBeenCalledWith(expect.objectContaining({ value: 'components' }));
  });

  it('supports custom item and ellipsis renderers', () => {
    render(
      <Breadcrumb
        ellipsis={[1, 3]}
        items={items}
        renderEllipsis={hiddenItems => (
          <span data-testid="custom-ellipsis">{hiddenItems.map(item => item.value).join(',')}</span>
        )}
        renderItem={item => <span data-testid={`custom-item-${item.value}`}>{item.label}</span>}
      />
    );

    expect(screen.getByTestId('custom-ellipsis')).toHaveTextContent('components,forms');
    expect(screen.getByTestId('custom-item-home')).toHaveTextContent('Home');
    expect(screen.getByTestId('custom-item-current')).toHaveTextContent('Current');
  });

  it('supports asChild links and clamps ellipsis ranges at the visible edges', () => {
    render(
      <Breadcrumb
        ellipsis={[0, items.length]}
        items={[
          {
            asChild: true,
            href: '/custom-home',
            label: <a>Custom Home</a>,
            value: 'home'
          },
          ...items.slice(1)
        ]}
        renderEllipsis={hiddenItems => (
          <span data-testid="clamped-ellipsis">{hiddenItems.map(item => item.value).join(',')}</span>
        )}
      />
    );

    expect(screen.getByRole('link', { name: 'Custom Home' })).toHaveAttribute('href', '/custom-home');
    expect(screen.getByTestId('clamped-ellipsis')).toHaveTextContent('components,forms,input');
    expect(screen.getByRole('link', { name: 'Current' })).toHaveAttribute('aria-current', 'page');
  });
});
