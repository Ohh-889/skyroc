import { describe, expect, it, vi } from 'vitest';
import { RadioGroup } from '../src/preset/radio';
import { Switch } from '../src/preset/switch';
import { Tabs } from '../src/preset/tabs';
import { render, screen, setupUser } from './helpers/render';

describe('Switch', () => {
  it('toggles checked state and emits the next value', async () => {
    const user = setupUser();
    const onCheckedChange = vi.fn();

    render(
      <Switch
        aria-label="Notifications"
        onCheckedChange={onCheckedChange}
      />
    );

    const control = screen.getByRole('switch', { name: 'Notifications' });

    expect(control).not.toBeChecked();

    await user.click(control);

    expect(control).toBeChecked();
    expect(onCheckedChange).toHaveBeenLastCalledWith(true);
  });
});

describe('RadioGroup', () => {
  it('updates uncontrolled selection and emits selected value', async () => {
    const user = setupUser();
    const onValueChange = vi.fn();

    render(
      <RadioGroup
        defaultValue="email"
        items={[
          { label: 'Email', value: 'email' },
          { label: 'SMS', value: 'sms' }
        ]}
        onValueChange={onValueChange}
      />
    );

    expect(screen.getByRole('radio', { name: 'Email' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'SMS' })).not.toBeChecked();

    await user.click(screen.getByRole('radio', { name: 'SMS' }));

    expect(screen.getByRole('radio', { name: 'SMS' })).toBeChecked();
    expect(onValueChange).toHaveBeenLastCalledWith('sms');
  });
});

describe('Tabs', () => {
  it('switches active tab content and skips disabled triggers', async () => {
    const user = setupUser();

    render(
      <Tabs
        defaultValue="profile"
        items={[
          { children: 'Profile content', label: 'Profile', value: 'profile' },
          { children: 'Billing content', label: 'Billing', value: 'billing' },
          { children: 'Security content', disabled: true, label: 'Security', value: 'security' }
        ]}
      />
    );

    expect(screen.getByRole('tab', { name: 'Profile', selected: true })).toBeInTheDocument();
    expect(screen.getByText('Profile content')).toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: 'Billing' }));

    expect(screen.getByRole('tab', { name: 'Billing', selected: true })).toBeInTheDocument();
    expect(screen.getByText('Billing content')).toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: 'Security' }));

    expect(screen.getByRole('tab', { name: 'Billing', selected: true })).toBeInTheDocument();
    expect(screen.getByText('Billing content')).toBeInTheDocument();
  });
});
