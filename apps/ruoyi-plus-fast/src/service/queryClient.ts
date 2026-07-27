import { createQueryClient } from '@skyroc/service/query';

function handleError(error: unknown) {
  if (import.meta.env.DEV) {
    // oxlint-disable-next-line no-console
    console.error('Query/Mutation error:', error);
  }
}

export const queryClient = createQueryClient({
  mutationCache: { onError: handleError },
  queryCache: { onError: handleError }
});
