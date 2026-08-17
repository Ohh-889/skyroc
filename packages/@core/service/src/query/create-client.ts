import type { DefaultOptions } from '@tanstack/react-query';
import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { DEFAULT_MUTATION_CONFIG, DEFAULT_QUERY_CONFIG } from './defaults';

type MutationCacheConfig = ConstructorParameters<typeof MutationCache>[0];
type QueryCacheConfig = ConstructorParameters<typeof QueryCache>[0];

export interface CreateQueryClientOptions {
  /** 覆盖默认 defaultOptions（会与内置默认值浅合并） */
  defaultOptions?: DefaultOptions;
  /** MutationCache 配置（onError / onSuccess / onSettled / onMutate） */
  mutationCache?: MutationCacheConfig;
  /** QueryCache 配置（onError / onSuccess / onSettled） */
  queryCache?: QueryCacheConfig;
}

/** 创建平台无关的 QueryClient 实例 */
export function createQueryClient(options: CreateQueryClientOptions = {}) {
  const { defaultOptions, mutationCache, queryCache } = options;

  return new QueryClient({
    defaultOptions: {
      // 先摊开原样透传 dehydrate / hydrate 这些没有内置默认值的键，只逐字段兜底 queries 和 mutations
      ...defaultOptions,
      mutations: { ...DEFAULT_MUTATION_CONFIG, ...defaultOptions?.mutations },
      queries: { ...DEFAULT_QUERY_CONFIG, ...defaultOptions?.queries }
    },
    mutationCache: new MutationCache(mutationCache),
    queryCache: new QueryCache(queryCache)
  });
}
