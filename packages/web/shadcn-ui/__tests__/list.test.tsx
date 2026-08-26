import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { ListContent, ListDescription, ListItem, ListRoot, ListTitle } from '../src/components/list';
import { ConfigProvider } from '../src/preset/config-provider';
import { List } from '../src/preset/list';
import { render, screen } from './helpers/render';

describe('List', () => {
  it('renders list item slots, leading and trailing content, and automatic dividers', () => {
    const ref = createRef<HTMLUListElement>();

    render(
      <List
        ref={ref}
        aria-label="Settings"
        className="custom-list-root"
        classNames={{
          content: 'custom-list-content',
          description: 'custom-list-description',
          item: 'custom-list-item',
          root: 'configured-list-root',
          title: 'custom-list-title'
        }}
        items={[
          {
            content: <a href="/profile">Open profile</a>,
            description: 'Manage your public profile',
            leading: <span aria-label="profile leading">P</span>,
            title: 'Profile',
            trailing: <button type="button">Edit</button>
          },
          {
            content: <span>Protected by MFA</span>,
            description: 'Password and verification settings',
            title: 'Security'
          }
        ]}
      />
    );

    const list = screen.getByRole('list', { name: 'Settings' });
    const items = screen.getAllByRole('listitem');
    const title = screen.getByText('Profile');
    const description = screen.getByText('Manage your public profile');
    const content = screen.getByRole('link', { name: 'Open profile' });

    expect(ref.current).toBe(list);
    expect(list).toHaveAttribute('data-slot', 'list-root');
    expect(list).toHaveClass('custom-list-root');
    expect(list).not.toHaveClass('configured-list-root');
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveAttribute('data-slot', 'list-item');
    expect(items[0]).toHaveClass('custom-list-item');
    expect(title).toHaveAttribute('data-slot', 'list-title');
    expect(title).toHaveClass('custom-list-title');
    expect(description).toHaveAttribute('data-slot', 'list-description');
    expect(description).toHaveClass('custom-list-description');
    expect(content.closest('[data-slot="list-content"]')).toHaveClass('custom-list-content');
    expect(screen.getByLabelText('profile leading')).toHaveTextContent('P');
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    expect(screen.getAllByRole('separator')).toHaveLength(1);
  });

  it('supports item-level props and custom dividers', () => {
    render(
      <List
        aria-label="Tasks"
        items={[
          {
            content: 'Queued for review',
            contentProps: {
              'aria-label': 'Task content',
              className: 'custom-content-prop'
            },
            description: 'Needs attention',
            descriptionProps: {
              'aria-label': 'Task description',
              className: 'custom-description-prop'
            },
            divider: <hr data-testid="custom-divider" />,
            title: 'Inbox',
            titleProps: {
              className: 'custom-title-prop',
              id: 'inbox-title'
            }
          },
          {
            divider: false,
            title: 'Done'
          },
          {
            content: 'Rendered without a title',
            description: 'Description only'
          }
        ]}
      />
    );

    const title = screen.getByText('Inbox');
    const description = screen.getByLabelText('Task description');

    expect(title).toHaveAttribute('id', 'inbox-title');
    expect(title).toHaveClass('custom-title-prop');
    expect(description).toHaveTextContent('Needs attention');
    expect(description).toHaveClass('custom-description-prop');
    expect(screen.getByLabelText('Task content')).toHaveClass('custom-content-prop');
    expect(screen.getByText('Description only')).toHaveAttribute('data-slot', 'list-description');
    expect(screen.getByText('Rendered without a title')).toBeInTheDocument();
    expect(screen.getByTestId('custom-divider')).toBeInTheDocument();
    expect(screen.getAllByRole('separator')).toHaveLength(1);
  });

  it('renders primitive list parts and forwards refs from the root', () => {
    const ref = createRef<HTMLUListElement>();

    render(
      <ListRoot
        ref={ref}
        aria-label="Primitive list"
        className="primitive-list-root"
        size="xl"
      >
        <ListItem
          className="primitive-list-item"
          size="xl"
        >
          <ListContent
            className="primitive-list-content"
            size="xl"
          >
            <ListTitle
              className="primitive-list-title"
              size="xl"
            >
              Primitive title
            </ListTitle>
            <ListDescription
              className="primitive-list-description"
              size="xl"
            >
              Primitive description
            </ListDescription>
          </ListContent>
        </ListItem>
      </ListRoot>
    );

    const root = screen.getByRole('list', { name: 'Primitive list' });
    const item = screen.getByRole('listitem');

    expect(ref.current).toBe(root);
    expect(root).toHaveAttribute('data-slot', 'list-root');
    expect(root).toHaveClass('primitive-list-root', 'text-lg');
    expect(item).toHaveAttribute('data-slot', 'list-item');
    expect(item).toHaveClass('primitive-list-item', 'gap-6');
    expect(screen.getByText('Primitive title')).toHaveClass('primitive-list-title', 'text-xl');
    expect(screen.getByText('Primitive description')).toHaveClass('primitive-list-description');
    expect(screen.getByText('Primitive title').closest('[data-slot="list-content"]')).toHaveClass(
      'primitive-list-content'
    );
  });

  it('uses ConfigProvider list defaults and lets component props override them', () => {
    render(
      <ConfigProvider
        list={{
          className: 'configured-list-root',
          classNames: {
            item: 'configured-list-item'
          },
          size: 'lg'
        }}
      >
        <List
          aria-label="Configured list"
          items={[
            {
              title: 'Configured'
            }
          ]}
        />
        <List
          aria-label="Overridden list"
          className="override-list-root"
          items={[
            {
              title: 'Overridden'
            }
          ]}
          size="sm"
        />
      </ConfigProvider>
    );

    const configuredList = screen.getByRole('list', { name: 'Configured list' });
    const overriddenList = screen.getByRole('list', { name: 'Overridden list' });
    const configuredItem = screen.getByText('Configured').closest('[data-slot="list-item"]');

    expect(configuredList).toHaveClass('configured-list-root', 'text-base');
    expect(configuredItem).toHaveClass('configured-list-item');
    expect(overriddenList).toHaveClass('override-list-root', 'text-xs');
    expect(overriddenList).not.toHaveClass('configured-list-root', 'text-base');
  });
});
