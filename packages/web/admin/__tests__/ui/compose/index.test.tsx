import type BScroll from '@better-scroll/core';
import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import type { DependencyList, ElementType, ReactNode } from 'react';
import { createRef } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  BetterScroll,
  DarkModeContainer,
  FlipText,
  I18nLabel,
  LazyAnimate,
  LookForward,
  NumberTicker,
  Portal,
  SvgIcon,
  TypingAnimation,
  WaveBg
} from '@shell/ui/compose';
import animateFeature from '@shell/ui/compose/animate-feature';

interface MotionElementProps {
  animate?: unknown;
  children?: ReactNode;
  initial?: unknown;
  transition?: unknown;
  variants?: unknown;
  whileInView?: unknown;
}

type DomElementProps = MotionElementProps & Record<string, unknown>;

const MOTION_ONLY_PROPS = ['animate', 'initial', 'transition', 'variants', 'whileInView'] as const;

const EmptyComponent = () => null;

function pickDomProps(props: DomElementProps) {
  const domProps = { ...props };

  MOTION_ONLY_PROPS.forEach(prop => {
    delete domProps[prop];
  });

  return domProps;
}

const betterScrollMocks = vi.hoisted(() => ({
  instances: [] as Record<string, unknown>[],
  BScroll: vi.fn(function MockBScroll(this: Record<string, unknown>, wrapper: Element, options: unknown) {
    this.options = options;
    this.refresh = vi.fn();
    this.wrapper = wrapper;
    betterScrollMocks.instances.push(this);
  })
}));

const ahooksMocks = vi.hoisted(() => ({
  contentSize: { height: 100, width: 100 },
  mountImmediately: false,
  useSizeCallIndex: 0,
  wrapperSize: { height: 100, width: 100 }
}));

const colorMocks = vi.hoisted(() => ({
  getPaletteColorByNumber: vi.fn((color: string, number: number) => `${color}-${number}`)
}));

const intersectionMocks = vi.hoisted(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
  trigger: null as null | ((isIntersecting: boolean) => void)
}));

const motionMocks = vi.hoisted(() => ({
  animate: vi.fn(),
  cancel: vi.fn(),
  domMax: { name: 'domMax' },
  loadedFeatures: vi.fn(),
  useInView: vi.fn(() => true)
}));

vi.mock('@better-scroll/core', () => ({
  default: betterScrollMocks.BScroll
}));

vi.mock('@iconify/react', async () => {
  const ReactModule = await vi.importActual<typeof import('react')>('react');

  return {
    Icon: (props: { className?: string; icon: string }) =>
      ReactModule.createElement('span', {
        className: props.className,
        'data-icon': props.icon,
        role: 'img'
      })
  };
});

vi.mock('@skyroc/color', () => ({
  getPaletteColorByNumber: colorMocks.getPaletteColorByNumber
}));

vi.mock('ahooks', async () => {
  const ReactModule = await vi.importActual<typeof import('react')>('react');

  return {
    useMount: (effect: () => void) => {
      if (ahooksMocks.mountImmediately) {
        effect();

        return;
      }

      ReactModule.useEffect(() => {
        effect();
      }, []);
    },
    useSize: () => {
      const size = ahooksMocks.useSizeCallIndex % 2 === 0 ? ahooksMocks.wrapperSize : ahooksMocks.contentSize;
      ahooksMocks.useSizeCallIndex += 1;

      return size;
    },
    useUpdateEffect: (effect: () => void | (() => void), deps: DependencyList) => {
      const mounted = ReactModule.useRef(false);

      ReactModule.useEffect(() => {
        if (mounted.current) {
          return effect();
        }

        mounted.current = true;

        return undefined;
      }, deps);
    }
  };
});

vi.mock('motion/react', async () => {
  const ReactModule = await vi.importActual<typeof import('react')>('react');

  type MotionValueListener = (latest: number) => void;

  function createMotionValue(initialValue: number) {
    let currentValue = initialValue;
    const listeners = new Set<MotionValueListener>();

    return {
      get: () => currentValue,
      on: (_event: string, listener: MotionValueListener) => {
        listeners.add(listener);

        return () => {
          listeners.delete(listener);
        };
      },
      set: (nextValue: number) => {
        currentValue = nextValue;
        listeners.forEach(listener => listener(nextValue));
      }
    };
  }

  function createMotionElement(Component: ElementType) {
    return ReactModule.forwardRef<HTMLElement, DomElementProps>((props, ref) => {
      return ReactModule.createElement(Component, {
        ...pickDomProps(props),
        ref
      });
    });
  }

  motionMocks.animate.mockImplementation(
    (_from: number, to: number, options?: { onUpdate?: (latest: number) => void }) => {
      options?.onUpdate?.(to);

      return {
        cancel: motionMocks.cancel
      };
    }
  );

  return {
    AnimatePresence: (props: { children: ReactNode }) =>
      ReactModule.createElement(ReactModule.Fragment, null, props.children),
    LazyMotion: (props: { children: ReactNode; features: () => Promise<unknown> }) => {
      ReactModule.useEffect(() => {
        props.features().then(features => {
          motionMocks.loadedFeatures(features);
        });
      }, [props.features]);

      return ReactModule.createElement('div', { 'data-testid': 'lazy-motion' }, props.children);
    },
    animate: motionMocks.animate,
    domMax: motionMocks.domMax,
    motion: {
      create: (Component: ElementType) => createMotionElement(Component),
      span: createMotionElement('span')
    },
    useInView: motionMocks.useInView,
    useMotionValue: (initialValue: number) => createMotionValue(initialValue),
    useSpring: (motionValue: ReturnType<typeof createMotionValue>) => motionValue
  };
});

vi.mock('react-i18next', async () => {
  const ReactModule = await vi.importActual<typeof import('react')>('react');

  return {
    Translation: (props: { children: (t: (key: string) => string) => ReactNode }) =>
      ReactModule.createElement(
        ReactModule.Fragment,
        null,
        props.children(key => `translated:${key}`)
      )
  };
});

beforeEach(() => {
  class MockIntersectionObserver {
    records: IntersectionObserverEntry[] = [];

    constructor(callback: IntersectionObserverCallback) {
      intersectionMocks.trigger = (isIntersecting: boolean) => {
        callback([{ isIntersecting } as IntersectionObserverEntry], this as unknown as IntersectionObserver);
      };
    }

    disconnect = intersectionMocks.disconnect;

    observe = intersectionMocks.observe;

    takeRecords = () => this.records;

    unobserve = vi.fn();
  }

  ahooksMocks.contentSize = { height: 100, width: 100 };
  ahooksMocks.mountImmediately = false;
  ahooksMocks.useSizeCallIndex = 0;
  ahooksMocks.wrapperSize = { height: 100, width: 100 };
  betterScrollMocks.instances = [];
  motionMocks.useInView.mockReturnValue(true);
  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
});

afterEach(() => {
  cleanup();
  document.body.replaceChildren();
  vi.clearAllMocks();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe('@shell/ui/compose exports', () => {
  it('exposes the public component surface', () => {
    expect(BetterScroll).toBeTypeOf('function');
    expect(DarkModeContainer).toBeTypeOf('function');
    expect(FlipText).toBeTypeOf('function');
    expect(I18nLabel).toBeTypeOf('function');
    expect(LazyAnimate).toBeTypeOf('function');
    expect(LookForward).toBeTypeOf('function');
    expect(NumberTicker).toBeTypeOf('function');
    expect(Portal).toBeTypeOf('function');
    expect(SvgIcon).toBeTypeOf('function');
    expect(TypingAnimation).toBeTypeOf('function');
    expect(WaveBg).toBeTypeOf('function');
  });

  it('exposes the domMax animation feature bundle', () => {
    expect(animateFeature).toBe(motionMocks.domMax);
  });
});

describe('BetterScroll', () => {
  it('renders the wrapper/content structure and initializes BScroll with options', async () => {
    const options = { bounce: false, scrollY: true };
    const ref = createRef<BScroll>();

    const { container } = render(
      <BetterScroll
        className="custom-scroll"
        options={options}
        ref={ref}
      >
        <span>Scrollable content</span>
      </BetterScroll>
    );

    await waitFor(() => {
      expect(betterScrollMocks.BScroll).toHaveBeenCalledOnce();
    });

    const wrapper = container.firstElementChild as HTMLElement;
    const content = screen.getByText('Scrollable content').parentElement;

    expect(wrapper).toHaveClass('h-full', 'text-left', 'custom-scroll');
    expect(content).toHaveClass('inline-block');
    expect(content).not.toHaveClass('h-full');
    expect(betterScrollMocks.BScroll).toHaveBeenCalledWith(wrapper, options);
  });

  it('refreshes the BScroll instance when measured dimensions change', async () => {
    const ref = createRef<BScroll>();

    const { rerender } = render(
      <BetterScroll
        options={{ scrollY: false }}
        ref={ref}
      >
        <span>Initial content</span>
      </BetterScroll>
    );

    await waitFor(() => {
      expect(betterScrollMocks.BScroll).toHaveBeenCalledOnce();
    });

    ahooksMocks.wrapperSize = { height: 100, width: 160 };
    ahooksMocks.contentSize = { height: 100, width: 180 };

    rerender(
      <BetterScroll
        options={{ scrollY: false }}
        ref={ref}
      >
        <span>Updated content</span>
      </BetterScroll>
    );

    const instance = betterScrollMocks.instances[0];

    await waitFor(() => {
      expect(instance.refresh).toHaveBeenCalledOnce();
    });

    expect(screen.getByText('Updated content').parentElement).toHaveClass('h-full');
  });

  it('does not initialize BScroll before the wrapper ref is attached', () => {
    ahooksMocks.mountImmediately = true;
    const ref = createRef<BScroll>();

    render(
      <BetterScroll
        options={{}}
        ref={ref}
      >
        <span>Early mount content</span>
      </BetterScroll>
    );

    expect(betterScrollMocks.BScroll).not.toHaveBeenCalled();
  });
});

describe('DarkModeContainer', () => {
  it('renders children with base, inverted, and custom classes', () => {
    render(
      <DarkModeContainer
        className="custom-container"
        data-testid="container"
        inverted
      >
        Content
      </DarkModeContainer>
    );

    expect(screen.getByTestId('container')).toHaveClass(
      'bg-container',
      'text-base-text',
      'bg-inverted',
      'text-#1f1f1f',
      'custom-container'
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});

describe('FlipText', () => {
  it('splits the word into animated letter elements', () => {
    const { container } = render(
      <FlipText
        className="letter"
        delayMultiple={0.2}
        duration={1}
        word="UI"
      />
    );

    const letters = Array.from(container.querySelectorAll('span'));

    expect(letters.map(letter => letter.textContent).join('')).toBe('UI');
    expect(letters[0]).toHaveClass('drop-shadow-sm', 'letter');
  });
});

describe('I18nLabel', () => {
  it('renders fallback content when no i18n key is provided', () => {
    render(<I18nLabel fallback={<span>Fallback label</span>} />);

    expect(screen.getByText('Fallback label')).toBeInTheDocument();
  });

  it('renders translated text when an i18n key is provided', () => {
    render(<I18nLabel i18nKey="common.save" />);

    expect(screen.getByText('translated:common.save')).toBeInTheDocument();
  });
});

describe('LazyAnimate', () => {
  it('wraps children in LazyMotion and loads domMax features', async () => {
    render(
      <LazyAnimate>
        <span>Animated child</span>
      </LazyAnimate>
    );

    expect(screen.getByTestId('lazy-motion')).toBeInTheDocument();
    expect(screen.getByText('Animated child')).toBeInTheDocument();

    await waitFor(() => {
      expect(motionMocks.loadedFeatures).toHaveBeenCalledWith(motionMocks.domMax);
    });
  });
});

describe('LookForward', () => {
  it('renders the default local icon and fallback title', () => {
    const { container } = render(<LookForward title="Preparing" />);

    expect(screen.getByText('Preparing')).toBeInTheDocument();
    expect(container.querySelector('use')).toHaveAttribute('href', '#icon-local-expectation');
  });

  it('renders custom children instead of the fallback title', () => {
    render(
      <LookForward title="Preparing">
        <p>Custom content</p>
      </LookForward>
    );

    expect(screen.getByText('Custom content')).toBeInTheDocument();
    expect(screen.queryByText('Preparing')).not.toBeInTheDocument();
  });
});

describe('NumberTicker', () => {
  it('updates the displayed value after the configured delay', () => {
    vi.useFakeTimers();

    render(
      <NumberTicker
        decimalPlaces={1}
        delay={0.1}
        prefix="$"
        suffix="USD"
        value={1234.56}
      />
    );

    const ticker = screen.getByText('$ 0 USD');

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(ticker).toHaveTextContent('$ 1,234.6 USD');
  });

  it('does not start the delayed spring update before entering view', () => {
    vi.useFakeTimers();
    motionMocks.useInView.mockReturnValue(false);

    render(
      <NumberTicker
        delay={0.1}
        prefix="Hidden"
        value={10}
      />
    );

    const ticker = screen.getByText('Hidden 0');

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(ticker).toHaveTextContent('Hidden 0');
  });

  it('ignores delayed spring updates after unmount', () => {
    vi.useFakeTimers();

    const { unmount } = render(
      <NumberTicker
        delay={0.1}
        value={12}
      />
    );

    unmount();

    expect(() => {
      act(() => {
        vi.advanceTimersByTime(100);
      });
    }).not.toThrow();
  });

  it('uses a duration-based animation when duration is provided', () => {
    const { container } = render(
      <NumberTicker
        duration={0.2}
        prefix="Total"
        value={42}
      />
    );

    expect(motionMocks.animate).toHaveBeenCalledWith(
      0,
      42,
      expect.objectContaining({
        duration: 0.2,
        onUpdate: expect.any(Function)
      })
    );
    expect(container.firstElementChild).toHaveTextContent('Total 42');
  });

  it('animates down from the value to zero when direction is down', () => {
    const { container } = render(
      <NumberTicker
        direction="down"
        duration={0.2}
        suffix="left"
        value={8}
      />
    );

    expect(motionMocks.animate).toHaveBeenCalledWith(
      8,
      0,
      expect.objectContaining({
        duration: 0.2,
        onUpdate: expect.any(Function)
      })
    );
    expect(container.firstElementChild).toHaveTextContent('0 left');
  });
});

describe('Portal', () => {
  it('renders fallback content before a target element is found', () => {
    render(
      <Portal
        container="#missing-target"
        fallback={<span>Missing target</span>}
      >
        <span>Portal content</span>
      </Portal>
    );

    expect(screen.getByText('Missing target')).toBeInTheDocument();
    expect(screen.queryByText('Portal content')).not.toBeInTheDocument();
  });

  it('renders fallback content when the runtime target value is unsupported', () => {
    render(
      <Portal
        container={null as unknown as HTMLElement}
        fallback={<span>Unsupported target</span>}
      >
        <span>Portal content</span>
      </Portal>
    );

    expect(screen.getByText('Unsupported target')).toBeInTheDocument();
    expect(screen.queryByText('Portal content')).not.toBeInTheDocument();
  });

  it('renders children into an existing id target', async () => {
    const target = document.createElement('section');
    target.id = 'portal-target';
    document.body.appendChild(target);

    render(
      <Portal container="#portal-target">
        <span>Portal content</span>
      </Portal>
    );

    await waitFor(() => {
      expect(target).toHaveTextContent('Portal content');
    });
  });

  it('renders children into an HTMLElement target', async () => {
    const target = document.createElement('section');
    document.body.appendChild(target);

    render(
      <Portal container={target}>
        <span>Element portal</span>
      </Portal>
    );

    await waitFor(() => {
      expect(target).toHaveTextContent('Element portal');
    });
  });

  it('renders children into a CSS selector target', async () => {
    const target = document.createElement('section');
    target.className = 'portal-selector-target';
    document.body.appendChild(target);

    render(
      <Portal container=".portal-selector-target">
        <span>Selector portal</span>
      </Portal>
    );

    await waitFor(() => {
      expect(target).toHaveTextContent('Selector portal');
    });
  });

  it('auto-creates and cleans up the target element', async () => {
    const { unmount } = render(
      <Portal
        autoCreate
        container="#created-target"
        tagName="section"
      >
        <span>Created portal</span>
      </Portal>
    );

    await waitFor(() => {
      expect(document.getElementById('created-target')).toHaveTextContent('Created portal');
    });

    unmount();

    expect(document.getElementById('created-target')).toBeNull();
  });

  it('auto-creates a plain string target without a hash prefix', async () => {
    const { unmount } = render(
      <Portal
        autoCreate
        container="plain-created-target"
      >
        <span>Plain created portal</span>
      </Portal>
    );

    await waitFor(() => {
      expect(document.getElementById('plain-created-target')).toHaveTextContent('Plain created portal');
    });

    unmount();

    expect(document.getElementById('plain-created-target')).toBeNull();
  });
});

describe('SvgIcon', () => {
  it('renders local svg icons and normalizes empty local names', () => {
    const { container, rerender } = render(
      <SvgIcon
        className="local-icon"
        localIcon="home"
      />
    );

    expect(container.querySelector('svg')).toHaveClass('local-icon');
    expect(container.querySelector('use')).toHaveAttribute('href', '#icon-local-home');

    rerender(<SvgIcon localIcon="" />);

    expect(container.querySelector('use')).toHaveAttribute('href', '#icon-local-no-icon');
  });

  it('renders Iconify icons when no local icon is provided', () => {
    render(
      <SvgIcon
        className="remote-icon"
        icon="mdi:home"
      />
    );

    expect(screen.getByRole('img')).toHaveAttribute('data-icon', 'mdi:home');
    expect(screen.getByRole('img')).toHaveClass('remote-icon');
  });
});

describe('TypingAnimation', () => {
  it('types the text after delay using the configured interval', async () => {
    vi.useFakeTimers();

    const { container } = render(
      <TypingAnimation
        as="p"
        className="typed-text"
        delay={20}
        duration={10}
      >
        Hey
      </TypingAnimation>
    );

    const element = container.querySelector('p') as HTMLElement;

    expect(element).toHaveClass('tracking-[-0.02em]', 'typed-text');
    expect(element).toHaveTextContent('');

    await act(async () => {
      vi.advanceTimersByTime(20);
    });

    await act(async () => {
      vi.advanceTimersByTime(40);
    });

    expect(container.querySelector('p')).toHaveTextContent('Hey');
  });

  it('starts typing only after the element intersects the viewport', async () => {
    vi.useFakeTimers();

    const { container } = render(
      <TypingAnimation
        duration={10}
        startOnView
      >
        View
      </TypingAnimation>
    );

    const element = container.firstElementChild as HTMLElement;

    expect(intersectionMocks.observe).toHaveBeenCalledWith(element);

    await act(async () => {
      intersectionMocks.trigger?.(false);
      vi.advanceTimersByTime(50);
    });

    expect(element).toHaveTextContent('');

    await act(async () => {
      intersectionMocks.trigger?.(true);
      vi.advanceTimersByTime(0);
    });

    await act(async () => {
      vi.advanceTimersByTime(50);
    });

    expect(container.firstElementChild).toHaveTextContent('View');
    expect(intersectionMocks.disconnect).toHaveBeenCalled();
  });

  it('does not observe when the motion element renders without a DOM node', () => {
    render(
      <TypingAnimation
        as={EmptyComponent}
        startOnView
      >
        Hidden
      </TypingAnimation>
    );

    expect(intersectionMocks.observe).not.toHaveBeenCalled();
  });
});

describe('WaveBg', () => {
  it('builds the wave gradients from the theme color palette', () => {
    const { container } = render(<WaveBg themeColor="#1677ff" />);

    expect(colorMocks.getPaletteColorByNumber).toHaveBeenCalledWith('#1677ff', 200);
    expect(colorMocks.getPaletteColorByNumber).toHaveBeenCalledWith('#1677ff', 500);
    expect(container.querySelector('stop[offset="0"]')).toHaveAttribute('stop-color', '#1677ff-200');
    expect(container.querySelector('stop[offset="1"]')).toHaveAttribute('stop-color', '#1677ff-500');
  });
});
