import { useSettingsTheme } from '@skyroc/web-admin-theme';
import { Outlet, RouterContextProvider, useRouter } from '@tanstack/react-router';
import type { AnyRouter, RouterState } from '@tanstack/react-router';
import type { Transition, Variants } from 'motion/react';
import { motion } from 'motion/react';
import { useRef } from 'react';
import type { ReactNode } from 'react';

import { useAdminLayoutContext } from '../context';
import { useRoute } from '../features/use-route';
import { getTabIdByRoute } from '../state/tabs/shared';
import { useAdminTab } from '../state/tabs/use-admin-tab';
import { useAdminState } from '../state/use-admin-state';

const pageAnimationVariants: Record<Theme.ThemePageAnimateMode, Variants> = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 }
  },
  'fade-slide': {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0 }
  },
  'fade-bottom': {
    initial: { opacity: 0, y: '-10%' },
    animate: { opacity: 1, y: 0 }
  },
  'fade-scale': {
    initial: { opacity: 0, scale: 1.2 },
    animate: { opacity: 1, scale: 1 }
  },
  'zoom-fade': {
    initial: { opacity: 0, scale: 0.92 },
    animate: { opacity: 1, scale: 1 }
  },
  'zoom-out': {
    initial: { opacity: 0, scale: 0 },
    animate: { opacity: 1, scale: 1 }
  },
  none: {
    initial: {},
    animate: {}
  }
};

const pageAnimationTransitions: Record<Theme.ThemePageAnimateMode, Transition> = {
  fade: { duration: 0.3, ease: 'easeInOut' },
  'fade-slide': { duration: 0.3, ease: 'easeInOut' },
  'fade-bottom': { duration: 0.3, ease: 'easeInOut' },
  'fade-scale': { duration: 0.28, ease: 'easeInOut' },
  'zoom-fade': { duration: 0.3, ease: 'easeOut' },
  'zoom-out': { duration: 0.15, ease: 'easeOut' },
  none: { duration: 0 }
};

interface KeepAliveKeysOptions {
  activeCacheKey: string;
  routeKeepAlive?: boolean | null;
  tabs: App.Global.Tab[];
}

type RouterStateSnapshot = RouterState<AnyRouter['routeTree']>;

interface KeepAliveEntry {
  /** 当前缓存项最近一次激活时的内容 key。 */
  contentKey: string;
  /** 当前缓存项对应的路由缓存 key。 */
  key: string;
  /** 当前缓存项最近一次激活时的 TanStack Router 状态快照。 */
  routeState: RouterStateSnapshot;
}

interface StaticRouterStore {
  /** 兼容 @tanstack/react-store 的快照读取方法。 */
  get: () => RouterStateSnapshot;
  /** 静态路由状态，供 TanStack 的 useRouterState 读取。 */
  readonly state: RouterStateSnapshot;
  /** 静态快照不会主动发布更新，但需要提供订阅接口。 */
  subscribe: () => { unsubscribe: () => void };
}

interface KeepAliveEntriesOptions {
  activeCacheKey: string;
  contentKey: string;
  entries: KeepAliveEntry[];
  keepAliveKeys: string[];
  routeState: RouterStateSnapshot;
  shouldRenderContent: boolean;
}

interface CachedRoutePaneProps {
  /** 当前缓存项是否是正在展示的页面。 */
  active: boolean;
  /** 当前页面动画模式。 */
  animationMode: Theme.ThemePageAnimateMode;
  /** 当前缓存项的路由缓存 key。 */
  cacheKey: string;
  /** 自定义内容插槽，未提供时渲染 TanStack Router Outlet。 */
  content?: ReactNode;
  /** 缓存项记录的内容 key，用于路由刷新时重新挂载内容。 */
  contentKey: string;
  /** 当前缓存项使用的路由状态快照。 */
  routeState: RouterStateSnapshot;
  /** 应用于页面动画的 transition 配置。 */
  transition: Transition;
  /** 应用于页面动画的 variants 配置。 */
  variants: Variants;
}

function getPageAnimationMode(page?: Theme.ThemeSetting['page']) {
  if (!page?.animate) {
    return 'none';
  }

  return page.animateMode;
}

function getKeepAliveKeys(options: KeepAliveKeysOptions) {
  const { activeCacheKey, routeKeepAlive, tabs } = options;

  const keepAliveKeys = tabs.filter(tab => tab.keepAlive).map(tab => tab.id);

  if (routeKeepAlive && activeCacheKey && !keepAliveKeys.includes(activeCacheKey)) {
    keepAliveKeys.push(activeCacheKey);
  }

  return keepAliveKeys;
}

function getRouteCacheKey(route: ReturnType<typeof useRoute>) {
  return getTabIdByRoute(route.originPath, route.staticData?.tab?.multi ?? false, route.fullPath);
}

function getRouteContentKey(route: ReturnType<typeof useRoute>) {
  if (route.staticData?.tab?.multi) {
    return route.fullPath || route.pathname;
  }

  return route.pathname || route.originPath;
}

function createStaticRouterStore(routeState: RouterStateSnapshot): StaticRouterStore {
  return {
    get state() {
      return routeState;
    },
    get() {
      return routeState;
    },
    subscribe() {
      return {
        unsubscribe() {}
      };
    }
  };
}

function createSnapshotRouter(router: AnyRouter, routeState: RouterStateSnapshot) {
  const snapshotRouter = Object.assign(Object.create(Object.getPrototypeOf(router)), router) as AnyRouter;

  snapshotRouter.__store = createStaticRouterStore(routeState) as unknown as AnyRouter['__store'];
  snapshotRouter.latestLocation = routeState.location;

  return snapshotRouter;
}

function getKeepAliveEntries(options: KeepAliveEntriesOptions) {
  const { activeCacheKey, contentKey, entries, keepAliveKeys, routeState, shouldRenderContent } = options;

  const keepAliveKeySet = new Set(keepAliveKeys);
  const nextEntries = entries.filter(entry => keepAliveKeySet.has(entry.key));

  if (!shouldRenderContent) {
    return nextEntries.filter(entry => entry.key !== activeCacheKey);
  }

  if (!keepAliveKeySet.has(activeCacheKey)) {
    return nextEntries;
  }

  const activeEntry: KeepAliveEntry = {
    key: activeCacheKey,
    contentKey,
    routeState
  };
  const activeEntryIndex = nextEntries.findIndex(entry => entry.key === activeCacheKey);

  if (activeEntryIndex === -1) {
    return [...nextEntries, activeEntry];
  }

  return nextEntries.map(entry => (entry.key === activeCacheKey ? activeEntry : entry));
}

const CachedRoutePane = (props: CachedRoutePaneProps) => {
  const { active, animationMode, cacheKey, content, contentKey, routeState, transition, variants } = props;

  const router = useRouter();
  const snapshotRouter = createSnapshotRouter(router, routeState);

  return (
    <div
      aria-hidden={!active}
      className="h-full"
      data-keep-alive-key={cacheKey}
      style={{ display: active ? undefined : 'none' }}
    >
      <RouterContextProvider router={snapshotRouter}>
        <motion.div
          animate="animate"
          className="h-full"
          data-page-animation={animationMode}
          initial={false}
          key={contentKey}
          transition={transition}
          variants={variants}
        >
          {content ?? <Outlet />}
        </motion.div>
      </RouterContextProvider>
    </div>
  );
};

const GlobalContent = () => {
  const { content } = useAdminLayoutContext();
  const route = useRoute();
  const router = useRouter();
  const { tabs } = useAdminTab();
  const { reloadFlag } = useAdminState();
  const { page } = useSettingsTheme();
  const keepAliveEntriesRef = useRef<KeepAliveEntry[]>([]);

  const animationMode = getPageAnimationMode(page);
  const contentKey = getRouteContentKey(route);
  const activeCacheKey = getRouteCacheKey(route) || contentKey;
  const routeKeepAlive = route.staticData?.keepAlive;
  const keepAliveKeys = getKeepAliveKeys({ activeCacheKey, routeKeepAlive, tabs });
  const shouldRenderContent = reloadFlag !== false;
  const keepAliveEntries = getKeepAliveEntries({
    activeCacheKey,
    contentKey,
    entries: keepAliveEntriesRef.current,
    keepAliveKeys,
    routeState: router.state,
    shouldRenderContent
  });
  const isActiveRouteCached = keepAliveEntries.some(entry => entry.key === activeCacheKey);

  keepAliveEntriesRef.current = keepAliveEntries;

  return (
    <div className="h-full grow overflow-x-hidden bg-layout p-16px">
      {keepAliveEntries.map(entry => (
        <CachedRoutePane
          active={entry.key === activeCacheKey}
          animationMode={animationMode}
          cacheKey={entry.key}
          content={content}
          contentKey={entry.contentKey}
          key={entry.key}
          routeState={entry.routeState}
          transition={pageAnimationTransitions[animationMode]}
          variants={pageAnimationVariants[animationMode]}
        />
      ))}

      {shouldRenderContent && !isActiveRouteCached && (
        <motion.div
          animate="animate"
          className="h-full"
          data-page-animation={animationMode}
          initial="initial"
          key={contentKey}
          transition={pageAnimationTransitions[animationMode]}
          variants={pageAnimationVariants[animationMode]}
        >
          {content ?? <Outlet />}
        </motion.div>
      )}
    </div>
  );
};

export default GlobalContent;
