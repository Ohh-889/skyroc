import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import {
  PopoverAnchor,
  PopoverArrow,
  PopoverContent,
  PopoverRoot,
  PopoverTrigger
} from '../src/components/popover';
import { Popover } from '../src/preset/popover';
import { render, screen, setupUser, waitFor } from './helpers/render';

describe('Popover', () => {
  it('opens from the trigger, renders arrow content and closes from the close icon', async () => {
    const user = setupUser();
    const ref = createRef<HTMLDivElement>();
    const onOpenChange = vi.fn();

    render(
      <Popover
        ref={ref}
        arrowHeight={6}
        arrowProps={{ 'aria-label': 'Popover arrow' }}
        arrowWidth={12}
        className="custom-popover-content"
        classNames={{
          arrow: 'custom-popover-arrow',
          content: 'configured-popover-content'
        }}
        closeIcon={<button type="button">Close popover</button>}
        contentProps={{
          align: 'start',
          className: 'content-props-popover-content',
          side: 'right'
        }}
        showArrow
        trigger={<button type="button">Open popover</button>}
        onOpenChange={onOpenChange}
      >
        Popover details
      </Popover>
    );

    await user.click(screen.getByRole('button', { name: 'Open popover' }));

    const content = await screen.findByText('Popover details');
    const contentRoot = content.closest('[data-slot="popover-content"]');

    expect(contentRoot).toHaveClass('custom-popover-content');
    expect(contentRoot).not.toHaveClass('configured-popover-content', 'content-props-popover-content');
    expect(ref.current).toBe(contentRoot);
    expect(screen.getByLabelText('Popover arrow')).toHaveClass('custom-popover-arrow');
    expect(onOpenChange).toHaveBeenCalledWith(true);

    await user.click(screen.getByRole('button', { name: 'Close popover' }));

    await waitFor(() => {
      expect(screen.queryByText('Popover details')).not.toBeInTheDocument();
    });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('uses configured content classes and can render without a portal', () => {
    render(
      <Popover
        defaultOpen
        disabledPortal
        classNames={{ content: 'configured-popover-content' }}
        trigger={<button type="button">Configured popover</button>}
      >
        Configured details
      </Popover>
    );

    const content = screen.getByText('Configured details').closest('[data-slot="popover-content"]');

    expect(content).toHaveClass('configured-popover-content');
    expect(document.querySelector('[data-slot="popover-portal"]')).not.toBeInTheDocument();
    expect(document.querySelector('[data-slot="popover-arrow"]')).not.toBeInTheDocument();
  });

  it('uses content props classes and forced portal mounting when no slot class is provided', () => {
    render(
      <Popover
        forceMountPortal
        contentProps={{ className: 'content-props-popover-content' }}
        trigger={<button type="button">Forced popover</button>}
      >
        Forced details
      </Popover>
    );

    expect(screen.getByText('Forced details').closest('[data-slot="popover-content"]')).toHaveClass(
      'content-props-popover-content'
    );
  });

  it('renders composable primitives around a custom anchor', async () => {
    const user = setupUser();

    render(
      <PopoverRoot>
        <PopoverAnchor className="primitive-popover-anchor">
          <span>Anchor target</span>
        </PopoverAnchor>
        <PopoverTrigger asChild>
          <button type="button">Primitive popover</button>
        </PopoverTrigger>
        <PopoverContent
          avoidCollisions={false}
          className="primitive-popover-content"
          sideOffset={8}
        >
          Primitive details
          <PopoverArrow className="primitive-popover-arrow" />
        </PopoverContent>
      </PopoverRoot>
    );

    expect(screen.getByText('Anchor target').closest('[data-slot="popover-anchor"]')).toHaveClass(
      'primitive-popover-anchor'
    );

    await user.click(screen.getByRole('button', { name: 'Primitive popover' }));

    expect(await screen.findByText('Primitive details')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="popover-content"]')).toHaveClass('primitive-popover-content');
    expect(document.querySelector('[data-slot="popover-arrow"]')).toHaveClass('primitive-popover-arrow');
  });
});
