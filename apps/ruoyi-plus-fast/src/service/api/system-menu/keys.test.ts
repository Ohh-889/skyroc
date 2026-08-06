import { QueryClient } from '@tanstack/react-query';
import { describe, expect, it } from 'vitest';

import { SYSTEM_MENU_QUERY_KEYS } from './keys';

describe('SYSTEM_MENU_QUERY_KEYS', () => {
  it('invalidates menu list keys without matching menu detail keys', async () => {
    const queryClient = new QueryClient();
    const detailKey = SYSTEM_MENU_QUERY_KEYS.DETAIL(1628);
    const listKey = SYSTEM_MENU_QUERY_KEYS.LIST({});

    queryClient.setQueryData(detailKey, { menuId: 1628 });
    queryClient.setQueryData(listKey, []);

    await queryClient.invalidateQueries({ queryKey: SYSTEM_MENU_QUERY_KEYS.LISTS, refetchType: 'none' });

    expect(queryClient.getQueryState(detailKey)?.isInvalidated).toBe(false);
    expect(queryClient.getQueryState(listKey)?.isInvalidated).toBe(true);
  });
});
