// oxlint-disable import/no-unassigned-import
import type { TanStackDevtoolsReactPlugin } from '@tanstack/react-devtools';
import type { AnyRouter } from '@tanstack/react-router';
import type { DevToolsProps } from 'jotai-devtools';
import { useAtomsDevtools } from 'jotai-devtools/utils';
import type { Store } from 'jotai/vanilla/store';
import { Suspense, lazy, useMemo } from 'react';

import './Devtools.css';

interface DevtoolsProps {
  /** TanStack Router 实例，用于展示桌面应用路由状态。 */
  router: AnyRouter;
  /** 可选的 Jotai Store；未传入时检查默认 Store。 */
  store?: Store;
}

interface JotaiDevtoolsProps {
  /** 可选的 Jotai Store；未传入时检查默认 Store。 */
  store?: Store;
}

const JOTAI_DEVTOOLS_POSITION: NonNullable<DevToolsProps['position']> = 'bottom-left';

const TanStackDevtools = lazy(() =>
  import('@tanstack/react-devtools').then(module => ({ default: module.TanStackDevtools }))
);

const TanStackRouterDevtoolsPanel = lazy(() =>
  import('@tanstack/react-router-devtools').then(module => ({ default: module.TanStackRouterDevtoolsPanel }))
);

const JotaiDevTools = lazy(async () => {
  await import('jotai-devtools/styles.css');

  const module = await import('jotai-devtools');

  return { default: module.DevTools };
});

const JotaiDevtools = (props: JotaiDevtoolsProps) => {
  const { store } = props;

  useAtomsDevtools('skyroc-electron', { store });

  return (
    <span
      className="skyroc-electron-jotai-devtools"
      data-position={JOTAI_DEVTOOLS_POSITION}
    >
      <JotaiDevTools
        position={JOTAI_DEVTOOLS_POSITION}
        store={store}
      />
    </span>
  );
};

const Devtools = (props: DevtoolsProps) => {
  const { router, store } = props;

  const plugins = useMemo<TanStackDevtoolsReactPlugin[]>(() => {
    return [
      {
        id: 'tanstack-router',
        name: 'TanStack Router',
        render: (
          <Suspense fallback={null}>
            <TanStackRouterDevtoolsPanel router={router} />
          </Suspense>
        )
      }
    ];
  }, [router]);

  return (
    <Suspense fallback={null}>
      <TanStackDevtools
        config={{ position: 'bottom-right' }}
        plugins={plugins}
      />

      <JotaiDevtools store={store} />
    </Suspense>
  );
};

export default Devtools;
