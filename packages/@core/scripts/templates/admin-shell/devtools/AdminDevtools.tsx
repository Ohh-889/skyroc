// oxlint-disable import/no-unassigned-import
import type { TanStackDevtoolsReactInit, TanStackDevtoolsReactPlugin } from '@tanstack/react-devtools';
import type { QueryClient } from '@tanstack/react-query';
import type { AnyRouter } from '@tanstack/react-router';
import type { DevToolsProps } from 'jotai-devtools';
import type { Store } from 'jotai/vanilla/store';
import type { CSSProperties } from 'react';

import { useAtomsDevtools } from 'jotai-devtools/utils';
import { Suspense, lazy, useMemo } from 'react';

import './AdminDevtools.css';

type TanStackDevtoolsConfig = NonNullable<TanStackDevtoolsReactInit['config']>;
type AdminDevtoolsTheme = DevToolsProps['theme'];
type AdminDevtoolsTriggerOffsetValue = number | string;

export interface AdminJotaiDevtoolsTriggerOffset {
  /** Distance from the bottom viewport edge for the floating trigger. */
  bottom?: AdminDevtoolsTriggerOffsetValue;

  /** Distance from the left viewport edge for the floating trigger. */
  left?: AdminDevtoolsTriggerOffsetValue;

  /** Distance from the right viewport edge for the floating trigger. */
  right?: AdminDevtoolsTriggerOffsetValue;

  /** Distance from the top viewport edge for the floating trigger. */
  top?: AdminDevtoolsTriggerOffsetValue;
}

type JotaiDevtoolsTriggerOffsetStyle = CSSProperties & {
  '--skyroc-jotai-devtools-trigger-bottom'?: string;
  '--skyroc-jotai-devtools-trigger-left'?: string;
  '--skyroc-jotai-devtools-trigger-right'?: string;
  '--skyroc-jotai-devtools-trigger-top'?: string;
};

export interface AdminJotaiDevtoolsConfig {
  /** Redux DevTools connection name for the atom timeline. */
  name?: string;

  /** Whether to show the embedded Jotai inspector panel. */
  panel?: boolean;

  /** Jotai devtools panel position. */
  position?: DevToolsProps['position'];

  /** Whether to record atom changes in the Redux DevTools timeline. */
  timeline?: boolean;

  /** Fixed trigger offsets for avoiding app chrome such as the admin sider. */
  triggerOffset?: AdminJotaiDevtoolsTriggerOffset;
}

export interface AdminDevtoolsConfig {
  /** Whether any admin devtools should be rendered. */
  enabled?: boolean;

  /** Whether to enable Jotai devtools, or the detailed Jotai devtools options. */
  jotai?: boolean | AdminJotaiDevtoolsConfig;

  /** TanStack devtools trigger position. */
  position?: TanStackDevtoolsConfig['position'];

  /** Whether to enable the TanStack Query panel. */
  query?: boolean;

  /** Whether to enable the TanStack Router panel. */
  router?: boolean;

  /** Shared theme for all devtools panels. */
  theme?: AdminDevtoolsTheme;
}

export interface AdminDevtoolsProps {
  /** Devtools feature switches and shell options. */
  config?: AdminDevtoolsConfig;

  /** QueryClient instance used by the application. */
  queryClient?: QueryClient;

  /** TanStack Router instance used by the application. */
  router?: AnyRouter;

  /** Jotai store used by the application. */
  store?: Store;
}

interface JotaiAtomsDevtoolsProps {
  /** Redux DevTools connection name for the atom timeline. */
  name: string;

  /** Jotai store to inspect. */
  store?: Store;
}

interface JotaiDevtoolsProps {
  /** Jotai devtools feature switches and panel options. */
  config?: boolean | AdminJotaiDevtoolsConfig;

  /** Jotai store to inspect. */
  store?: Store;

  /** Shared theme inherited from the root devtools config. */
  theme?: AdminDevtoolsTheme;
}

const TanStackDevtools = lazy(() =>
  import('@tanstack/react-devtools').then(mod => ({ default: mod.TanStackDevtools }))
);

const ReactQueryDevtoolsPanel = lazy(() =>
  import('@tanstack/react-query-devtools').then(mod => ({ default: mod.ReactQueryDevtoolsPanel }))
);

const TanStackRouterDevtoolsPanel = lazy(() =>
  import('@tanstack/react-router-devtools').then(mod => ({ default: mod.TanStackRouterDevtoolsPanel }))
);

const JotaiDevTools = lazy(async () => {
  await import('jotai-devtools/styles.css');

  const mod = await import('jotai-devtools');

  return { default: mod.DevTools };
});

const JotaiAtomsDevtools = (props: JotaiAtomsDevtoolsProps) => {
  const { name, store } = props;

  useAtomsDevtools(name, { store });

  return null;
};

const JotaiDevtools = (props: JotaiDevtoolsProps) => {
  const { config, store, theme } = props;

  if (config === false) {
    return null;
  }

  const jotaiConfig = typeof config === 'object' ? config : {};
  const showPanel = jotaiConfig.panel !== false;
  const showTimeline = jotaiConfig.timeline !== false;
  const triggerOffsetStyle = createJotaiDevtoolsTriggerOffsetStyle(jotaiConfig.triggerOffset);

  if (!showPanel && !showTimeline) {
    return null;
  }

  return (
    <>
      {showTimeline ? <JotaiAtomsDevtools name={jotaiConfig.name ?? 'skyroc-admin'} store={store} /> : null}
      {showPanel ? (
        <span
          className="skyroc-admin-jotai-devtools"
          data-position={jotaiConfig.position ?? 'bottom-left'}
          style={triggerOffsetStyle}
        >
          <JotaiDevTools position={jotaiConfig.position} store={store} theme={theme} />
        </span>
      ) : null}
    </>
  );
};

function isEnabled(value: boolean | undefined) {
  return value !== false;
}

function formatCssSize(value: AdminDevtoolsTriggerOffsetValue | undefined) {
  if (typeof value === 'number') {
    return `${value}px`;
  }

  return value;
}

function createJotaiDevtoolsTriggerOffsetStyle(
  offset: AdminJotaiDevtoolsTriggerOffset | undefined
): JotaiDevtoolsTriggerOffsetStyle | undefined {
  if (!offset) {
    return undefined;
  }

  const { bottom, left, right, top } = offset;

  return {
    '--skyroc-jotai-devtools-trigger-bottom': formatCssSize(bottom),
    '--skyroc-jotai-devtools-trigger-left': formatCssSize(left),
    '--skyroc-jotai-devtools-trigger-right': formatCssSize(right),
    '--skyroc-jotai-devtools-trigger-top': formatCssSize(top)
  } satisfies JotaiDevtoolsTriggerOffsetStyle;
}

const AdminDevtools = (props: AdminDevtoolsProps) => {
  const { config = {}, queryClient, router, store } = props;

  const plugins = useMemo<TanStackDevtoolsReactPlugin[]>(() => {
    const items: TanStackDevtoolsReactPlugin[] = [];

    if (router && isEnabled(config.router)) {
      items.push({
        id: 'tanstack-router',
        name: 'TanStack Router',
        render: (
          <Suspense fallback={null}>
            <TanStackRouterDevtoolsPanel router={router} />
          </Suspense>
        )
      });
    }

    if (queryClient && isEnabled(config.query)) {
      items.push({
        id: 'tanstack-query',
        name: 'TanStack Query',
        render: (
          <Suspense fallback={null}>
            <ReactQueryDevtoolsPanel client={queryClient} />
          </Suspense>
        )
      });
    }

    return items;
  }, [config.query, config.router, queryClient, router]);

  const tanStackConfig = useMemo<TanStackDevtoolsConfig>(() => {
    return {
      position: config.position ?? 'bottom-right',
      theme: config.theme
    };
  }, [config.position, config.theme]);

  if (config.enabled === false) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      {plugins.length > 0 ? (
        <TanStackDevtools config={tanStackConfig} plugins={plugins} />
      ) : null}

      <JotaiDevtools config={config.jotai} store={store} theme={config.theme} />
    </Suspense>
  );
};

export default AdminDevtools;
