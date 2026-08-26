import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Accordion } from '../src/preset/accordion';
import { render, screen, setupUser } from './helpers/render';

function getControlledContent(trigger: HTMLElement) {
  const contentId = trigger.getAttribute('aria-controls');

  expect(contentId).toBeTruthy();

  return document.getElementById(contentId!)!;
}

describe('Accordion', () => {
  it('opens and closes single accordion items from their triggers', async () => {
    const user = setupUser();
    const onValueChange = vi.fn();

    render(
      <Accordion
        collapsible
        type="single"
        items={[
          { children: 'Account details', title: 'Account', value: 'account' },
          { children: 'Billing details', title: 'Billing', value: 'billing' }
        ]}
        onValueChange={onValueChange}
      />
    );

    const accountTrigger = screen.getByRole('button', { name: 'Account' });
    const accountContent = getControlledContent(accountTrigger);

    expect(accountTrigger).toHaveAttribute('data-state', 'closed');
    expect(accountContent).toHaveAttribute('data-state', 'closed');

    await user.click(accountTrigger);

    expect(accountTrigger).toHaveAttribute('data-state', 'open');
    expect(accountContent).toHaveAttribute('data-state', 'open');
    expect(screen.getByText('Account details')).toBeInTheDocument();
    expect(onValueChange).toHaveBeenLastCalledWith('account');

    await user.click(accountTrigger);

    expect(accountTrigger).toHaveAttribute('data-state', 'closed');
    expect(accountContent).toHaveAttribute('data-state', 'closed');
    expect(onValueChange).toHaveBeenLastCalledWith('');
  });

  it('supports multiple open items and prevents disabled items from opening', async () => {
    const user = setupUser();
    const onValueChange = vi.fn();

    render(
      <Accordion
        type="multiple"
        items={[
          { children: 'Profile content', title: 'Profile', value: 'profile' },
          { children: 'Security content', disabled: true, title: 'Security', value: 'security' }
        ]}
        onValueChange={onValueChange}
      />
    );

    const profileTrigger = screen.getByRole('button', { name: 'Profile' });
    const securityTrigger = screen.getByRole('button', { name: 'Security' });
    const securityContent = getControlledContent(securityTrigger);

    expect(securityTrigger).toBeDisabled();

    await user.click(profileTrigger);

    expect(profileTrigger).toHaveAttribute('data-state', 'open');
    expect(onValueChange).toHaveBeenLastCalledWith(['profile']);

    await user.click(securityTrigger);

    expect(securityContent).toHaveAttribute('data-state', 'closed');
    expect(onValueChange).toHaveBeenLastCalledWith(['profile']);
  });

  it('renders configured trigger slots, class names and forwards refs', () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <Accordion
        ref={ref}
        className="custom-accordion"
        classNames={{
          content: 'custom-content',
          item: 'custom-item',
          trigger: 'custom-trigger'
        }}
        defaultValue="advanced"
        triggerIcon={<span aria-label="expand icon">+</span>}
        triggerLeading={<span aria-label="leading icon">L</span>}
        triggerTrailing={<span aria-label="trailing content">T</span>}
        type="single"
        items={[
          { children: 'Advanced content', title: 'Advanced', value: 'advanced' }
        ]}
      />
    );

    const trigger = screen.getByRole('button', { name: /Advanced/ });
    const content = screen.getByText('Advanced content').closest('[data-slot="accordion-content"]');

    expect(ref.current).toHaveAttribute('data-slot', 'accordion-root');
    expect(ref.current).toHaveClass('custom-accordion');
    expect(trigger).toHaveClass('custom-trigger');
    expect(trigger).toHaveTextContent('Advanced');
    expect(screen.getByLabelText('expand icon')).toBeInTheDocument();
    expect(screen.getByLabelText('leading icon')).toBeInTheDocument();
    expect(screen.getByLabelText('trailing content')).toBeInTheDocument();
    expect(content).toHaveClass('custom-content');
  });
});
