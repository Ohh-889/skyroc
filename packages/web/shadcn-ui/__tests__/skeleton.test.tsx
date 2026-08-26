import { forwardRef, lazy, memo } from 'react';
import { createPortal } from 'react-dom';
import type { CSSProperties, ReactElement, ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import { Skeleton, SkeletonContainer } from '../src/components/skeleton';
import { render, screen } from './helpers/render';

interface CustomWidgetProps {
  /** Text content used to size the component skeleton. */
  children: ReactNode;
  /** Additional class name that should be preserved on the generated skeleton. */
  className?: string;
  /** Inline layout styles used by the generated skeleton fallback. */
  style?: CSSProperties;
}

const CustomWidget = (props: CustomWidgetProps) => {
  const { children, className, style } = props;

  return (
    <div
      className={className}
      style={style}
    >
      {children}
    </div>
  );
};

CustomWidget.displayName = 'CustomWidget';

const ForwardWidget = forwardRef<HTMLDivElement, CustomWidgetProps>((props, ref) => {
  const { children, className, style } = props;

  return (
    <div
      className={className}
      ref={ref}
      style={style}
    >
      {children}
    </div>
  );
});

ForwardWidget.displayName = 'ForwardWidget';

const MemoWidget = memo(CustomWidget);

MemoWidget.displayName = 'MemoWidget';

const LazyWidget = lazy(() => Promise.resolve({ default: CustomWidget }));

const NamedWidget = (props: CustomWidgetProps) => {
  const { children, className, style } = props;

  return (
    <div
      className={className}
      style={style}
    >
      {children}
    </div>
  );
};

const NamelessWidget = (props: CustomWidgetProps) => {
  const { children, className, style } = props;

  return (
    <div
      className={className}
      style={style}
    >
      {children}
    </div>
  );
};

Object.defineProperty(NamelessWidget, 'name', { value: '' });

describe('Skeleton', () => {
  it('renders the base skeleton element and only shows children while loading', () => {
    const { rerender } = render(
      <Skeleton
        className="custom-skeleton"
        data-testid="skeleton"
        loading
      >
        Loading content
      </Skeleton>
    );

    const skeleton = screen.getByTestId('skeleton');

    expect(skeleton).toHaveAttribute('data-slot', 'skeleton');
    expect(skeleton).toHaveClass('animate-pulse', 'rounded-md', 'custom-skeleton');
    expect(skeleton).toHaveTextContent('Loading content');

    rerender(
      <Skeleton
        data-testid="skeleton"
      >
        Hidden content
      </Skeleton>
    );

    expect(screen.getByTestId('skeleton')).not.toHaveTextContent('Hidden content');
  });

  it('returns children directly when the container is not loading', () => {
    render(
      <SkeletonContainer loading={false}>
        <p>Loaded content</p>
      </SkeletonContainer>
    );

    expect(screen.getByText('Loaded content')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="skeleton-container"]')).not.toBeInTheDocument();
  });

  it('skeletonizes text, media, interactive elements, empty blocks and React components', () => {
    render(
      <SkeletonContainer
        loading
        animation="wave"
        className="custom-skeleton-container"
        data-testid="skeleton-container"
        excludeKeys={['persist-action']}
        skeletonColor="rgb(1, 2, 3)"
        skeletonRadius="12px"
      >
        Plain text
        <section>
          <h3 style={{ width: '12rem' }}>User Name</h3>
          <p>
            <strong>Nested text</strong>
          </p>
          <img
            alt="Avatar"
            className="avatar-media"
            height={64}
            src="/avatar.png"
            width={48}
          />
          <button type="button">Save</button>
          <button
            key="persist-action"
            type="button"
          >
            Keep action
          </button>
          <div
            className="empty-block"
            style={{ height: '2rem', width: '2rem' }}
          />
          <CustomWidget className="custom-widget">Profile card</CustomWidget>
        </section>
      </SkeletonContainer>
    );

    const container = screen.getByTestId('skeleton-container');
    const mediaSkeleton = document.querySelector('[data-slot="skeleton-media"].avatar-media');
    const excludedButton = screen.getByRole('button', { name: 'Keep action' });

    expect(container).toHaveAttribute('aria-busy', 'true');
    expect(container).toHaveAttribute('aria-live', 'polite');
    expect(container).toHaveAttribute('data-loading', 'true');
    expect(container).toHaveClass('custom-skeleton-container', 'pointer-events-none');
    expect(screen.queryByRole('button', { name: 'Save' })).not.toBeInTheDocument();
    expect(excludedButton).toHaveAttribute('data-skeleton-exclude', 'true');
    expect(document.querySelectorAll('[data-slot="skeleton-text"]').length).toBeGreaterThanOrEqual(3);
    expect(mediaSkeleton).toHaveStyle({
      backgroundColor: 'rgb(1, 2, 3)',
      borderRadius: '12px',
      height: '64px',
      width: '48px'
    });
    expect(document.querySelector('[data-slot="skeleton-interactive"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="skeleton-media"].empty-block')).toHaveStyle({
      height: '32px',
      width: '32px'
    });
    expect(document.querySelector('[data-slot="skeleton-component"].custom-widget')).toBeInTheDocument();
  });

  it('covers fallback skeleton branches for component wrappers and unknown nodes', () => {
    function createSyntheticElement(type: unknown, className: string): ReactElement {
      return {
        $$typeof: Symbol.for('react.transitional.element'),
        _owner: null,
        _store: {},
        key: null,
        props: {
          children: <span>Nested action</span>,
          className
        },
        type
      } as unknown as ReactElement;
    }

    const payloadNamedElement = {
      $$typeof: Symbol.for('react.transitional.element'),
      _owner: null,
      _store: {},
      key: null,
      props: {
        children: 'Payload content',
        className: 'payload-widget'
      },
      type: {
        $$typeof: Symbol.for('react.memo'),
        _payload: {
          value: {
            displayName: 'PayloadWidget'
          }
        }
      }
    } as unknown as ReactElement;

    const customTypeElement = createSyntheticElement(
      {
        $$typeof: Symbol.for('custom.reactish'),
        displayName: 'button'
      },
      'custom-type-widget'
    );
    const missingTypeOfElement = createSyntheticElement({ displayName: 'button' }, 'missing-typeof-widget');

    const fullStyle = {
      aspectRatio: '1 / 1',
      flex: '1 1 auto',
      flexBasis: '12px',
      flexGrow: 1,
      flexShrink: 1,
      gridArea: 'profile',
      gridColumn: '1 / span 2',
      gridRow: '2 / span 3',
      height: '20px',
      maxHeight: '80px',
      maxWidth: '90px',
      minHeight: '10px',
      minWidth: '15px',
      width: '30px'
    };

    const { container } = render(
      <SkeletonContainer
        loading
        animation="none"
      >
        {123}
        {false}
        {true}
        {createPortal(<span data-testid="skeleton-portal-child">Portal child</span>, document.body)}
        <>
          Fragment text
          <span>Fragment detail</span>
        </>
        <time>Published at noon</time>
        <p className="empty-text" />
        <time
          className="empty-time"
          style={{ minWidth: '20px', width: '44px' }}
        />
        <input
          aria-label="Raw value"
          className="input-control"
          style={{ width: '120px' }}
          type="text"
        />
        <img
          alt="String sized media"
          className="string-media"
          height="3rem"
          src="/chart.png"
          width="40%"
        />
        <svg
          className="media-with-style"
          style={fullStyle}
        />
        <MemoWidget
          className="memo-widget"
          style={{ width: '88px' }}
        >
          <span>Memo content</span>
        </MemoWidget>
        <ForwardWidget className="forward-widget">Forward content</ForwardWidget>
        <LazyWidget className="lazy-widget">Lazy content</LazyWidget>
        <NamedWidget className="named-widget">Named content</NamedWidget>
        <NamelessWidget className="nameless-widget">Nameless content</NamelessWidget>
        {payloadNamedElement}
        {customTypeElement}
        {missingTypeOfElement}
      </SkeletonContainer>
    );

    expect(screen.getByTestId('skeleton-portal-child')).toHaveTextContent('Portal child');
    expect(screen.queryByText('Published at noon')).not.toBeInTheDocument();
    expect(container.querySelector('p.empty-text [data-slot="skeleton-text"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="skeleton-block"].empty-time')).toHaveStyle({
      minWidth: '20px',
      width: '44px'
    });
    expect(container.querySelector('[data-slot="skeleton-interactive"].input-control')).toHaveStyle({
      width: '120px'
    });
    expect(container.querySelector('[data-slot="skeleton-media"].string-media')).toHaveStyle({
      height: '48px',
      width: '40%'
    });
    expect(container.querySelector('[data-slot="skeleton-media"].media-with-style')).toHaveStyle({
      aspectRatio: '1 / 1',
      flexBasis: '12px',
      gridArea: 'profile',
      height: '20px',
      width: '30px'
    });
    expect(container.querySelector('[data-slot="skeleton-component"].memo-widget')).toHaveStyle({ width: '88px' });
    expect(container.querySelector('[data-slot="skeleton-component"].forward-widget')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="skeleton-component"].lazy-widget')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="skeleton-component"].named-widget')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="skeleton-component"].nameless-widget')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="skeleton-component"].payload-widget')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="skeleton-interactive"].custom-type-widget')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="skeleton-interactive"].missing-typeof-widget')).toBeInTheDocument();
  });

  it('respects the recursive skeletonization depth', () => {
    render(
      <SkeletonContainer
        loading
        depth={0}
      >
        <div>
          <p>Nested content stays visible</p>
        </div>
      </SkeletonContainer>
    );

    expect(screen.getByText('Nested content stays visible')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="skeleton-text"]')).not.toBeInTheDocument();
  });
});
