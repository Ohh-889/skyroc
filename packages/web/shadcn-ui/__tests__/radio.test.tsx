import { Root as RadioGroupRoot } from '@radix-ui/react-radio-group';
import { describe, expect, it, vi } from 'vitest';
import { Radio, RadioCardGroup, RadioGroup } from '../src/preset/radio';
import { render, screen, setupUser, within } from './helpers/render';

describe('Radio', () => {
  it('renders labelled group items with configured slots and disabled items', async () => {
    const user = setupUser();
    const onValueChange = vi.fn();

    render(
      <RadioGroup
        aria-label="Delivery method"
        classNames={{
          control: 'configured-radio-control',
          group: 'configured-radio-group',
          indicator: 'configured-radio-indicator',
          label: 'configured-radio-label',
          root: 'configured-radio-root'
        }}
        color="success"
        defaultValue="email"
        items={[
          {
            id: 'email-radio',
            label: 'Email',
            value: 'email'
          },
          {
            disabled: true,
            label: 'SMS',
            value: 'sms'
          }
        ]}
        orientation="vertical"
        size="lg"
        variant="outline"
        onValueChange={onValueChange}
      />
    );

    const group = screen.getByRole('radiogroup', { name: 'Delivery method' });
    const email = screen.getByRole('radio', { name: 'Email' });
    const sms = screen.getByRole('radio', { name: 'SMS' });

    expect(group).toHaveClass('configured-radio-group');
    expect(email.closest('[data-slot="radio-root"]')).toHaveClass('configured-radio-root');
    expect(email).toBeChecked();
    expect(email).toHaveClass('configured-radio-control');
    expect(email).toHaveAttribute('data-color', 'success');
    expect(screen.getByText('Email')).toHaveClass('configured-radio-label');
    expect(document.querySelector('[data-slot="radio-indicator"]')).toHaveClass('configured-radio-indicator');

    expect(sms).toBeDisabled();

    await user.click(sms);

    expect(email).toBeChecked();
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('renders the config-aware single radio wrapper inside a primitive root', () => {
    render(
      <RadioGroupRoot
        aria-label="Density"
        defaultValue="compact"
      >
        <Radio
          className="preset-radio-root"
          color="warning"
          id="compact-radio"
          label="Compact"
          value="compact"
        />
      </RadioGroupRoot>
    );

    expect(screen.getByRole('radio', { name: 'Compact' })).toBeChecked();
    expect(screen.getByText('Compact').closest('[data-slot="radio-root"]')).toHaveClass('preset-radio-root');
  });

  it('renders a single radio without a visible label', () => {
    render(
      <RadioGroupRoot
        aria-label="Tone"
        defaultValue="silent"
      >
        <Radio
          aria-label="Silent"
          value="silent"
        />
      </RadioGroupRoot>
    );

    expect(screen.getByRole('radio', { name: 'Silent' })).toBeChecked();
    expect(screen.queryByText('Silent')).not.toBeInTheDocument();
  });
});

describe('RadioCardGroup', () => {
  it('updates card selection and keeps disabled cards inert', async () => {
    const user = setupUser();
    const onValueChange = vi.fn();

    render(
      <RadioCardGroup
        aria-label="Plan"
        classNames={{
          card: 'configured-radio-card',
          cardContent: 'configured-radio-card-content',
          cardDescription: 'configured-radio-card-description',
          cardLabel: 'configured-radio-card-label',
          cardTextContent: 'configured-radio-card-text',
          control: 'configured-radio-card-control',
          group: 'configured-radio-card-group',
          indicator: 'configured-radio-card-indicator'
        }}
        color="info"
        defaultValue="starter"
        items={[
          {
            description: 'Starter plan',
            icon: <span aria-label="starter icon">S</span>,
            label: 'Starter',
            value: 'starter'
          },
          {
            description: 'Advanced plan',
            icon: <span aria-label="pro icon">P</span>,
            label: 'Pro',
            value: 'pro'
          },
          {
            description: 'Contact sales',
            disabled: true,
            label: 'Enterprise',
            value: 'enterprise'
          }
        ]}
        radioPosition="left"
        size="sm"
        variant="outline"
        onValueChange={onValueChange}
      />
    );

    const group = screen.getByRole('radiogroup', { name: 'Plan' });
    const starterCard = screen.getByText('Starter').closest('[data-slot="radio-card"]') as HTMLElement;
    const proCard = screen.getByText('Pro').closest('[data-slot="radio-card"]') as HTMLElement;
    const enterpriseCard = screen.getByText('Enterprise').closest('[data-slot="radio-card"]') as HTMLElement;

    expect(group).toHaveClass('configured-radio-card-group');
    expect(starterCard).toHaveAttribute('data-state', 'checked');
    expect(starterCard).toHaveClass('configured-radio-card');
    expect(starterCard.firstElementChild).toBe(within(starterCard).getByRole('radio'));
    expect(screen.getByText('Starter')).toHaveClass('configured-radio-card-label');
    expect(screen.getByText('Starter plan')).toHaveClass('configured-radio-card-description');
    expect(screen.getByLabelText('starter icon')).toBeInTheDocument();
    expect(within(starterCard).getByRole('radio')).toHaveClass('configured-radio-card-control');
    expect(starterCard.querySelector('[data-slot="radio-indicator"]')).toHaveClass('configured-radio-card-indicator');

    await user.click(within(proCard).getByRole('radio'));

    expect(proCard).toHaveAttribute('data-state', 'checked');
    expect(onValueChange).toHaveBeenLastCalledWith('pro');

    await user.click(within(enterpriseCard).getByRole('radio'));

    expect(within(enterpriseCard).getByRole('radio')).toBeDisabled();
    expect(proCard).toHaveAttribute('data-state', 'checked');
    expect(onValueChange).toHaveBeenLastCalledWith('pro');
  });

  it('renders right-positioned cards without label or description content', () => {
    render(
      <RadioCardGroup
        aria-label="Icon plan"
        defaultValue="icon-only"
        items={[
          {
            'aria-label': 'Icon only',
            icon: <span aria-label="icon badge">I</span>,
            value: 'icon-only'
          }
        ]}
      />
    );

    const card = screen.getByLabelText('icon badge').closest('[data-slot="radio-card"]') as HTMLElement;
    const radio = within(card).getByRole('radio', { name: 'Icon only' });

    expect(card).toHaveAttribute('data-state', 'checked');
    expect(card.lastElementChild).toBe(radio);
    expect(card.querySelector('[data-slot="radio-card-label"]')).not.toBeInTheDocument();
    expect(card.querySelector('[data-slot="radio-card-description"]')).not.toBeInTheDocument();
  });

  it('supports controlled card selection without a default value', () => {
    const { rerender } = render(
      <RadioCardGroup
        aria-label="Controlled plan"
        items={[
          {
            label: 'Basic',
            value: 'basic'
          },
          {
            label: 'Team',
            value: 'team'
          }
        ]}
        value="basic"
      />
    );

    const basicCard = screen.getByText('Basic').closest('[data-slot="radio-card"]') as HTMLElement;
    const teamCard = screen.getByText('Team').closest('[data-slot="radio-card"]') as HTMLElement;

    expect(basicCard).toHaveAttribute('data-state', 'checked');
    expect(teamCard).toHaveAttribute('data-state', 'unchecked');

    rerender(
      <RadioCardGroup
        aria-label="Controlled plan"
        items={[
          {
            label: 'Basic',
            value: 'basic'
          },
          {
            label: 'Team',
            value: 'team'
          }
        ]}
        value="team"
      />
    );

    expect(basicCard).toHaveAttribute('data-state', 'unchecked');
    expect(teamCard).toHaveAttribute('data-state', 'checked');
  });
});
