import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Collapsible, CollapsibleTrigger } from '../src/preset/collapsible';
import { render, screen, setupUser, waitFor } from './helpers/render';

describe('Collapsible', () => {
  it('renders default-open content with slot class names and forwards refs', () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <Collapsible
        ref={ref}
        className="custom-collapsible-root"
        classNames={{ content: 'custom-collapsible-content', root: 'configured-root' }}
        content={<div>Expanded details</div>}
        defaultOpen
      >
        <CollapsibleTrigger asChild>
          <button type="button">Toggle details</button>
        </CollapsibleTrigger>
      </Collapsible>
    );

    expect(ref.current).toHaveAttribute('data-slot', 'collapsible-root');
    expect(ref.current).toHaveClass('custom-collapsible-root');
    expect(ref.current).not.toHaveClass('configured-root');
    expect(screen.getByText('Expanded details').parentElement).toHaveAttribute('data-slot', 'collapsible-content');
    expect(screen.getByText('Expanded details').parentElement).toHaveClass('custom-collapsible-content');
  });

  it('toggles uncontrolled content from the trigger and emits open state changes', async () => {
    const user = setupUser();
    const onOpenChange = vi.fn();

    render(
      <Collapsible
        content={<div>Hidden details</div>}
        onOpenChange={onOpenChange}
      >
        <CollapsibleTrigger asChild>
          <button type="button">Toggle hidden details</button>
        </CollapsibleTrigger>
      </Collapsible>
    );

    expect(screen.queryByText('Hidden details')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Toggle hidden details' }));

    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    expect(await screen.findByText('Hidden details')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Toggle hidden details' }));

    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    await waitFor(() => {
      expect(screen.queryByText('Hidden details')).not.toBeInTheDocument();
    });
  });

  it('keeps forced content mounted while closed and uses configured root class names', () => {
    render(
      <Collapsible
        classNames={{ root: 'configured-root' }}
        content={<div>Mounted details</div>}
        forceMountContent
      >
        <CollapsibleTrigger asChild>
          <button type="button">Toggle mounted details</button>
        </CollapsibleTrigger>
      </Collapsible>
    );

    expect(screen.getByText('Mounted details').parentElement).toHaveAttribute('data-state', 'closed');
    expect(screen.getByText('Mounted details').closest('[data-slot="collapsible-root"]')).toHaveClass('configured-root');
  });
});
