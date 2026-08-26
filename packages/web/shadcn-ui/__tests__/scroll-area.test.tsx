import { describe, expect, it } from 'vitest';
import {
  ScrollArea,
  ScrollAreaRoot,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport
} from '../src/preset/scroll-area';
import { render, screen } from './helpers/render';

describe('ScrollArea', () => {
  it('renders the config-aware scroll area with all slots and horizontal sizing', () => {
    render(
      <ScrollArea
        className="configured-scroll-root"
        classNames={{
          corner: 'configured-scroll-corner',
          scrollbar: 'configured-scrollbar',
          thumb: 'configured-scroll-thumb',
          viewport: 'configured-scroll-viewport'
        }}
        orientation="horizontal"
        size="lg"
        thumbProps={{ forceMount: true }}
        type="always"
        viewportProps={{ 'aria-label': 'Messages viewport' }}
      >
        <div>Message one</div>
        <div>Message two</div>
      </ScrollArea>
    );

    const root = screen.getByText('Message one').closest('[data-slot="scroll-area-root"]');
    const viewport = document.querySelector('[data-slot="scroll-area-viewport"]');
    const scrollbar = document.querySelector('[data-slot="scroll-area-scrollbar"]');
    const thumb = document.querySelector('[data-slot="scroll-area-thumb"]');

    expect(root).toHaveClass('configured-scroll-root');
    expect(viewport).toHaveClass('configured-scroll-viewport');
    expect(viewport).toHaveAttribute('aria-label', 'Messages viewport');
    expect(scrollbar).toHaveClass('configured-scrollbar');
    expect(scrollbar).toHaveClass('h-3');
    expect(scrollbar).toHaveAttribute('data-orientation', 'horizontal');
    expect(thumb).toHaveClass('configured-scroll-thumb');
    expect(screen.getByText('Message two')).toBeInTheDocument();
  });

  it('renders primitive root, viewport, scrollbar and thumb composition', () => {
    render(
      <ScrollAreaRoot
        className="primitive-scroll-root"
        type="always"
      >
        <ScrollAreaViewport className="primitive-scroll-viewport">
          Primitive content
        </ScrollAreaViewport>
        <ScrollAreaScrollbar
          className="primitive-scrollbar"
          orientation="vertical"
          size="xs"
        >
          <ScrollAreaThumb
            forceMount
            className="primitive-scroll-thumb"
          />
        </ScrollAreaScrollbar>
      </ScrollAreaRoot>
    );

    const root = screen.getByText('Primitive content').closest('[data-slot="scroll-area-root"]');
    const viewport = document.querySelector('[data-slot="scroll-area-viewport"]');
    const scrollbar = document.querySelector('[data-slot="scroll-area-scrollbar"]');
    const thumb = document.querySelector('[data-slot="scroll-area-thumb"]');

    expect(root).toHaveClass('primitive-scroll-root');
    expect(viewport).toHaveClass('primitive-scroll-viewport');
    expect(scrollbar).toHaveClass('primitive-scrollbar');
    expect(scrollbar).toHaveClass('w-1.5');
    expect(scrollbar).toHaveAttribute('data-orientation', 'vertical');
    expect(thumb).toHaveClass('primitive-scroll-thumb');
  });

  it('uses the root slot class when root className is absent', () => {
    render(
      <ScrollArea
        classNames={{ root: 'configured-root-from-slots' }}
        type="always"
      >
        Root slot content
      </ScrollArea>
    );

    expect(screen.getByText('Root slot content').closest('[data-slot="scroll-area-root"]')).toHaveClass(
      'configured-root-from-slots'
    );
  });
});
