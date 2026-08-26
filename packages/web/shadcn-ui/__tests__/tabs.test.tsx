import { describe, expect, it, vi } from 'vitest';
import { ConfigProvider } from '../src/preset/config-provider';
import { Tabs } from '../src/preset/tabs';
import { render, screen, setupUser } from './helpers/render';

describe('Tabs', () => {
  it('renders data-driven tabs with slot class names, indicators and interaction callbacks', async () => {
    const user = setupUser();
    const onValueChange = vi.fn();

    render(
      <Tabs
        className="custom-tabs-root"
        classNames={{
          content: 'custom-tabs-content',
          indicator: 'custom-tabs-indicator',
          indicatorRoot: 'custom-tabs-indicator-root',
          list: 'custom-tabs-list',
          trigger: 'custom-tabs-trigger'
        }}
        defaultValue="account"
        items={[
          {
            children: 'Account panel',
            label: 'Account',
            value: 'account'
          },
          {
            children: 'Security panel',
            label: 'Security',
            value: 'security'
          },
          {
            children: 'Disabled panel',
            disabled: true,
            label: 'Disabled',
            value: 'disabled'
          }
        ]}
        size="lg"
        type="line"
        onValueChange={onValueChange}
      />
    );

    const tablist = screen.getByRole('tablist');
    const accountTab = screen.getByRole('tab', { name: 'Account' });
    const securityTab = screen.getByRole('tab', { name: 'Security' });
    const disabledTab = screen.getByRole('tab', { name: 'Disabled' });

    expect(accountTab.closest('.custom-tabs-root')).toBeInTheDocument();
    expect(tablist).toHaveClass('custom-tabs-list', 'border-b-[2px]');
    expect(accountTab).toHaveClass('custom-tabs-trigger', 'gap-2.5');
    expect(disabledTab).toBeDisabled();
    expect(document.querySelector('.custom-tabs-indicator-root')).toBeInTheDocument();
    expect(document.querySelector('.custom-tabs-indicator')).toBeInTheDocument();
    expect(screen.getByText('Account panel')).toHaveClass('custom-tabs-content');

    await user.click(securityTab);

    expect(onValueChange).toHaveBeenCalledWith('security');
    expect(screen.getByText('Security panel')).toHaveClass('custom-tabs-content');
  });

  it('supports render hooks, force-mounted content and ConfigProvider defaults', () => {
    render(
      <ConfigProvider
        tabs={{
          classNames: {
            list: 'configured-tabs-list',
            trigger: 'configured-tabs-trigger'
          },
          enableIndicator: false,
          orientation: 'vertical',
          size: 'xs'
        }}
      >
        <Tabs
          defaultValue="summary"
          forceMountContent
          items={[
            {
              children: 'Summary panel',
              label: 'Summary',
              value: 'summary'
            },
            {
              children: 'Details panel',
              label: 'Details',
              value: 'details'
            }
          ]}
          value="summary"
          renderContent={({ active, item }) => (
            <span>
              {active ? 'Active' : 'Inactive'}
              {' '}
              {item.children}
            </span>
          )}
          renderTrigger={({ active, item }) => (
            <span>
              {item.label}
              {' '}
              {active ? 'selected' : 'idle'}
            </span>
          )}
        />
      </ConfigProvider>
    );

    const tablist = screen.getByRole('tablist');
    const summaryTab = screen.getByRole('tab', { name: 'Summary selected' });
    const detailsTab = screen.getByRole('tab', { name: 'Details idle' });

    expect(tablist).toHaveAttribute('aria-orientation', 'vertical');
    expect(tablist).toHaveClass('configured-tabs-list', 'flex-col', 'p-0.75');
    expect(tablist.childElementCount).toBe(2);
    expect(summaryTab).toHaveClass('configured-tabs-trigger', 'gap-1');
    expect(detailsTab).toHaveClass('configured-tabs-trigger');
    expect(screen.getByText('Active Summary panel')).toBeInTheDocument();
    expect(screen.getByText('Inactive Details panel')).toBeInTheDocument();
  });

  it('keeps the indicator inert when no tab is active', () => {
    render(
      <Tabs
        classNames={{
          indicatorRoot: 'empty-tabs-indicator-root'
        }}
        items={[
          {
            children: 'First panel',
            label: 'First',
            value: 'first'
          },
          {
            children: 'Second panel',
            label: 'Second',
            value: 'second'
          }
        ]}
      />
    );

    const indicatorRoot = document.querySelector('.empty-tabs-indicator-root') as HTMLElement;

    expect(screen.getByRole('tablist')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'First' })).not.toHaveAttribute('data-state', 'active');
    expect(indicatorRoot).toHaveStyle({
      '--skyroc-tabs-indicator-position': 'nullpx',
      '--skyroc-tabs-indicator-size': 'nullpx'
    });
  });
});
