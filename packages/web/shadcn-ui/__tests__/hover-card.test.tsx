import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { HoverCard } from '../src/preset/hover-card';
import { render, screen, setupUser } from './helpers/render';

describe('HoverCard', () => {
  it('opens from the trigger and renders arrow and custom content classes', async () => {
    const user = setupUser();
    const ref = createRef<HTMLDivElement>();

    render(
      <HoverCard
        ref={ref}
        className="custom-hover-card-content"
        classNames={{
          arrow: 'custom-hover-card-arrow',
          content: 'configured-hover-card-content'
        }}
        contentProps={{
          align: 'start',
          side: 'right'
        }}
        openDelay={0}
        showArrow
        trigger={<button type="button">Profile</button>}
      >
        Profile details
      </HoverCard>
    );

    await user.hover(screen.getByRole('button', { name: 'Profile' }));

    const content = await screen.findByText('Profile details');

    expect(content.closest('[data-slot="hover-card-content"]')).toHaveClass('custom-hover-card-content');
    expect(content.closest('[data-slot="hover-card-content"]')).not.toHaveClass('configured-hover-card-content');
    expect(ref.current).toHaveAttribute('data-slot', 'hover-card-content');
    expect(document.querySelector('[data-slot="hover-card-arrow"]')).toHaveClass('custom-hover-card-arrow');
  });

  it('uses configured content classes and omits the arrow by default', () => {
    render(
      <HoverCard
        classNames={{ content: 'configured-hover-card-content' }}
        defaultOpen
        trigger={<button type="button">Team</button>}
      >
        Team details
      </HoverCard>
    );

    expect(screen.getByText('Team details').closest('[data-slot="hover-card-content"]')).toHaveClass(
      'configured-hover-card-content'
    );
    expect(document.querySelector('[data-slot="hover-card-arrow"]')).not.toBeInTheDocument();
  });
});
