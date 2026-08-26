import { describe, expect, it } from 'vitest';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '../src/components/resizable';
import { render, screen } from './helpers/render';

describe('Resizable', () => {
  it('renders a panel group with panels and the default handle icon', () => {
    const { container } = render(
      <ResizablePanelGroup
        className="configured-panel-group"
        id="resizable-group"
        orientation="horizontal"
        size="lg"
      >
        <ResizablePanel defaultSize={40}>Left panel</ResizablePanel>
        <ResizableHandle
          withHandle
          aria-label="Resize columns"
          className="configured-resize-handle"
        />
        <ResizablePanel defaultSize={60}>Right panel</ResizablePanel>
      </ResizablePanelGroup>
    );

    const group = screen.getByText('Left panel').closest('[data-group="true"]');
    const handle = screen.getByRole('separator', { name: 'Resize columns' });

    expect(group).toHaveClass('configured-panel-group');
    expect(group).toHaveStyle({ flexDirection: 'row' });
    expect(screen.getByText('Left panel')).toBeInTheDocument();
    expect(screen.getByText('Right panel')).toBeInTheDocument();
    expect(handle).toHaveClass('configured-resize-handle');
    expect(container.querySelector('.lucide-grip-vertical')).toBeInTheDocument();
  });

  it('renders custom handle content and supports a handle without visual affordance', () => {
    render(
      <ResizablePanelGroup
        id="vertical-resizable-group"
        orientation="vertical"
        size="sm"
      >
        <ResizablePanel defaultSize={30}>Top panel</ResizablePanel>
        <ResizableHandle
          withHandle
          aria-label="Resize rows"
          classNames={{
            handleIcon: 'configured-handle-icon',
            handleIconRoot: 'configured-handle-icon-root'
          }}
        >
          <span aria-label="Custom grip">G</span>
        </ResizableHandle>
        <ResizablePanel defaultSize={40}>Middle panel</ResizablePanel>
        <ResizableHandle
          aria-label="Plain resize handle"
          className="plain-resize-handle"
        />
        <ResizablePanel defaultSize={30}>Bottom panel</ResizablePanel>
      </ResizablePanelGroup>
    );

    const group = screen.getByText('Top panel').closest('[data-group="true"]');
    const customGrip = screen.getByLabelText('Custom grip');
    const customHandle = screen.getByRole('separator', { name: 'Resize rows' });
    const plainHandle = screen.getByRole('separator', { name: 'Plain resize handle' });

    expect(group).toHaveStyle({ flexDirection: 'column' });
    expect(customGrip).toHaveClass('configured-handle-icon');
    expect(customGrip.parentElement).toHaveClass('configured-handle-icon-root');
    expect(customHandle).toContainElement(customGrip);
    expect(plainHandle).toHaveClass('plain-resize-handle');
    expect(plainHandle).toBeEmptyDOMElement();
  });
});
