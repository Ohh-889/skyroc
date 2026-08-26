import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ConfigProvider } from '../src/preset/config-provider';
import { Select } from '../src/preset/select';
import { render, screen, setupUser, waitFor } from './helpers/render';

describe('Select', () => {
  it('selects enabled options and ignores disabled options', async () => {
    const user = setupUser();
    const onValueChange = vi.fn();

    render(
      <Select
        items={[
          { label: 'Apple', value: 'apple' },
          { disabled: true, label: 'Banana', value: 'banana' },
          {
            children: [{ label: 'Carrot', value: 'carrot' }],
            label: 'Vegetables',
            type: 'group'
          }
        ]}
        triggerProps={{ placeholder: 'Choose food' }}
        onValueChange={onValueChange}
      />
    );

    const trigger = screen.getByRole('combobox');

    await user.click(trigger);
    await user.click(await screen.findByRole('option', { name: 'Banana' }));

    expect(onValueChange).not.toHaveBeenCalled();

    await user.click(screen.getByRole('option', { name: 'Carrot' }));

    expect(onValueChange).toHaveBeenLastCalledWith('carrot');
    await waitFor(() => {
      expect(trigger).toHaveTextContent('Carrot');
    });
  });

  it('renders configured slots, groups, separators and custom indicators', async () => {
    const user = setupUser();
    const ref = createRef<HTMLDivElement>();

    render(
      <Select
        ref={ref}
        classNames={{
          content: 'configured-select-content',
          group: 'custom-select-group',
          groupLabel: 'custom-select-group-label',
          item: 'custom-select-item',
          itemIndicator: 'custom-select-indicator',
          scrollDownButton: 'configured-scroll-down',
          scrollUpButton: 'configured-scroll-up',
          selectedValue: 'custom-selected-value',
          separator: 'custom-select-separator',
          trigger: 'configured-select-trigger',
          triggerIcon: 'configured-trigger-icon',
          viewport: 'configured-select-viewport'
        }}
        contentProps={{
          'aria-label': 'Food options',
          className: 'custom-select-content',
          classNames: {
            viewport: 'custom-select-viewport'
          },
          scrollDownButton: <span aria-label="scroll down">Down</span>,
          scrollUpButton: <span aria-label="scroll up">Up</span>
        }}
        defaultValue="apple"
        indicatorIcon={<span aria-label="selected indicator">Selected</span>}
        items={[
          {
            label: 'Apple',
            leading: <span aria-label="apple leading">A</span>,
            trailing: <span aria-label="apple trailing">Fresh</span>,
            value: 'apple'
          },
          { type: 'separator' },
          {
            children: [
              {
                label: 'Carrot',
                value: 'carrot'
              }
            ],
            label: 'Vegetables',
            type: 'group'
          }
        ]}
        size="lg"
        triggerProps={{
          'aria-label': 'Food',
          className: 'custom-select-trigger',
          leading: <span aria-label="trigger leading">Food</span>,
          placeholder: 'Choose food',
          trailing: <span aria-label="trigger trailing">Required</span>,
          triggerIcon: <span aria-label="trigger icon">Toggle</span>
        }}
      />
    );

    const trigger = screen.getByRole('combobox', { name: 'Food' });

    expect(trigger).toHaveClass('custom-select-trigger', 'h-9');
    expect(trigger).not.toHaveClass('configured-select-trigger');
    expect(screen.getByLabelText('trigger leading')).toHaveTextContent('Food');
    expect(screen.getByLabelText('trigger trailing')).toHaveTextContent('Required');
    expect(screen.getByLabelText('trigger icon')).toHaveClass('configured-trigger-icon');
    expect(trigger).toHaveTextContent('Apple');

    await user.click(trigger);

    const listbox = await screen.findByRole('listbox', { name: 'Food options' });

    expect(ref.current).toBe(listbox);
    expect(listbox).toHaveAttribute('data-slot', 'select-content');
    expect(listbox).toHaveClass('custom-select-content');
    expect(listbox).not.toHaveClass('configured-select-content');
    expect(document.querySelector('[data-slot="viewport"]')).toHaveClass('custom-select-viewport');
    expect(screen.getByText('Vegetables')).toHaveClass('custom-select-group-label');
    expect(document.querySelector('[data-slot="select-group"]')).toHaveClass('custom-select-group');
    expect(document.querySelector('[data-slot="select-separator"]')).toHaveClass('custom-select-separator');
    expect(screen.getByRole('option', { name: /Apple/ })).toHaveClass('custom-select-item');
    expect(screen.getByLabelText('apple leading')).toHaveTextContent('A');
    expect(screen.getByLabelText('apple trailing')).toHaveTextContent('Fresh');
    expect(screen.getByLabelText('selected indicator')).toHaveClass('custom-select-indicator');
  });

  it('renders with default trigger and content options when optional props are omitted', async () => {
    const user = setupUser();

    render(
      <Select
        defaultValue="plain"
        items={[{ label: 'Plain option', value: 'plain' }]}
      />
    );

    const trigger = screen.getByRole('combobox');

    expect(trigger).toHaveAttribute('data-slot', 'select-trigger');
    expect(trigger).toHaveClass('h-8');
    expect(trigger).toHaveTextContent('Plain option');

    await user.click(trigger);

    expect(await screen.findByRole('listbox')).toHaveClass('max-h-80');
  });

  it('uses ConfigProvider select defaults and lets props override them', () => {
    render(
      <ConfigProvider
        select={{
          classNames: {
            trigger: 'configured-select-trigger'
          },
          size: 'xl'
        }}
      >
        <Select
          items={[{ label: 'Configured option', value: 'configured' }]}
          triggerProps={{ 'aria-label': 'Configured select' }}
        />
        <Select
          items={[{ label: 'Overridden option', value: 'overridden' }]}
          size="xs"
          triggerProps={{
            'aria-label': 'Overridden select',
            className: 'override-select-trigger'
          }}
        />
      </ConfigProvider>
    );

    const configuredTrigger = screen.getByRole('combobox', { name: 'Configured select' });
    const overriddenTrigger = screen.getByRole('combobox', { name: 'Overridden select' });

    expect(configuredTrigger).toHaveClass('configured-select-trigger', 'h-10');
    expect(overriddenTrigger).toHaveClass('override-select-trigger', 'h-6');
    expect(overriddenTrigger).not.toHaveClass('configured-select-trigger', 'h-10');
  });
});
