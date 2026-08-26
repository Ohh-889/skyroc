import { describe, expect, it, vi } from 'vitest';
import { Segment } from '../src/preset/segment';
import { render, screen, setupUser } from './helpers/render';

describe('Segment', () => {
  it('switches active segment and keeps item-level disabled options inert', async () => {
    const user = setupUser();
    const onValueChange = vi.fn();

    render(
      <Segment
        className="configured-segment-root"
        classNames={{
          indicator: 'configured-segment-indicator',
          indicatorRoot: 'configured-segment-indicator-root',
          list: 'configured-segment-list',
          root: 'configured-segment-root-slot',
          trigger: 'configured-segment-trigger'
        }}
        defaultValue="day"
        items={[
          { label: 'Day', value: 'day' },
          { label: 'Week', value: 'week' },
          { disabled: true, label: 'Month', value: 'month' }
        ]}
        shape="rounded"
        size="lg"
        type="line"
        onValueChange={onValueChange}
      />
    );

    const root = screen.getByRole('tablist').closest('[data-slot="segment-root"]');
    const tabList = screen.getByRole('tablist');
    const day = screen.getByRole('tab', { name: 'Day', selected: true });
    const week = screen.getByRole('tab', { name: 'Week' });
    const month = screen.getByRole('tab', { name: 'Month' });

    expect(root).toHaveClass('configured-segment-root');
    expect(root).toHaveClass('configured-segment-root-slot');
    expect(tabList).toHaveClass('configured-segment-list');
    expect(day).toHaveClass('configured-segment-trigger');
    expect(document.querySelector('.configured-segment-indicator-root')).toBeInTheDocument();
    expect(document.querySelector('.configured-segment-indicator')).toBeInTheDocument();
    expect(month).toBeDisabled();

    await user.click(week);

    expect(screen.getByRole('tab', { name: 'Week', selected: true })).toBeInTheDocument();
    expect(onValueChange).toHaveBeenLastCalledWith('week');

    await user.click(month);

    expect(screen.getByRole('tab', { name: 'Week', selected: true })).toBeInTheDocument();
    expect(onValueChange).toHaveBeenCalledTimes(1);
  });

  it('applies vertical disabled configuration without rendering an indicator', () => {
    render(
      <Segment
        disabled
        classNames={{
          indicator: 'disabled-segment-indicator',
          indicatorRoot: 'disabled-segment-indicator-root',
          root: 'disabled-segment-root-slot'
        }}
        defaultValue="compact"
        enableIndicator={false}
        items={[
          { label: 'Compact', value: 'compact' },
          { label: 'Comfort', value: 'comfort' }
        ]}
        listProps={{ className: 'disabled-segment-list' }}
        orientation="vertical"
        triggerProps={{ className: 'disabled-segment-trigger' }}
      />
    );

    const root = screen.getByRole('tablist').closest('[data-slot="segment-root"]');
    const tabList = screen.getByRole('tablist');
    const compact = screen.getByRole('tab', { name: 'Compact', selected: true });
    const comfort = screen.getByRole('tab', { name: 'Comfort' });

    expect(root).toHaveClass('disabled-segment-root-slot');
    expect(root).toHaveAttribute('data-orientation', 'vertical');
    expect(tabList).toHaveClass('disabled-segment-list');
    expect(tabList).toHaveAttribute('aria-orientation', 'vertical');
    expect(compact).toHaveClass('disabled-segment-trigger');
    expect(compact).toBeDisabled();
    expect(comfort).toBeDisabled();
    expect(document.querySelector('.disabled-segment-indicator-root')).not.toBeInTheDocument();
    expect(document.querySelector('.disabled-segment-indicator')).not.toBeInTheDocument();
  });
});
