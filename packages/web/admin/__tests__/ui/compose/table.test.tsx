import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { getAntdColumns, useTable } from '@shell/ui/compose/table/use-table';
import type {
  PaginatingQueryRecord,
  TableColumn,
  TableDataWithIndex,
  TableQueryHookOptions
} from '@shell/ui/compose/table/types';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, params?: { total?: number }) => {
      if (key === 'datatable.itemCount') {
        return `Total ${params?.total ?? 0} items`;
      }

      return key;
    }
  })
}));

interface TestQueryProviderProps {
  /** 被测 Hook 子树。 */
  children: ReactNode;
  /** 测试用 React Query client。 */
  client: QueryClient;
}

interface HookWrapperProps {
  /** 被测 Hook 子树。 */
  children: ReactNode;
}

interface UserRecord {
  /** 用户 ID。 */
  id: number;
  /** 用户名称。 */
  name: string;
  /** 用户状态。 */
  status: string;
}

interface UserSearchParams {
  /** 当前页码。 */
  current: number;
  /** 关键字。 */
  keyword?: string;
  /** 每页条数。 */
  size: number;
}

type UserTableColumn = TableColumn<TableDataWithIndex<UserRecord>>;

const TestQueryProvider = (props: TestQueryProviderProps) => {
  const { children, client } = props;

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};

describe('table hooks', () => {
  it('fetches paginated data through TanStack Query and updates submitted params', async () => {
    const client = createQueryClient();
    const apiFn = vi.fn(async (params: UserSearchParams): Promise<PaginatingQueryRecord<UserRecord>> => {
      return {
        current: params.current,
        records: [{ id: params.current, name: `user-${params.current}`, status: '1' }],
        size: params.size,
        total: 40
      };
    });

    const { result } = renderHook(
      () =>
        useTable({
          apiParams: { current: 1, size: 10 },
          columns: createUserColumns,
          queryHook: createUserQueryHook(apiFn)
        }),
      {
        wrapper: createWrapper(client)
      }
    );

    await waitFor(() => {
      expect(result.current.data[0]?.name).toBe('user-1');
    });

    expect(result.current.data[0]?.index).toBe(1);
    expect(apiFn).toHaveBeenLastCalledWith({ current: 1, size: 10 });

    act(() => {
      result.current.updateSearchParams({ current: 2, size: 20 });
    });

    await waitFor(() => {
      expect(result.current.data[0]?.name).toBe('user-2');
    });

    expect(result.current.data[0]?.index).toBe(21);
    expect(apiFn).toHaveBeenLastCalledWith({ current: 2, size: 20 });
  });

  it('keeps user column order and settings when columns are reloaded', () => {
    const client = createQueryClient();
    let columns = createUserColumns();

    const { result } = renderHook(
      () =>
        useTable({
          columns: () => columns,
          immediate: false,
          queryHook: createUserQueryHook(createEmptyUserResponse)
        }),
      {
        wrapper: createWrapper(client)
      }
    );

    act(() => {
      result.current.setColumnChecks([
        { checked: true, fixed: 'left', key: 'status', title: 'Status', visible: true },
        { checked: false, fixed: 'unFixed', key: 'name', title: 'Name', visible: true }
      ]);
    });

    columns = [
      { dataIndex: 'name', key: 'name', title: 'Full name' },
      { dataIndex: 'status', key: 'status', title: 'State' },
      { dataIndex: 'role', key: 'role', title: 'Role' }
    ];

    act(() => {
      result.current.reloadColumns();
    });

    expect(result.current.columnChecks).toEqual([
      { checked: true, fixed: 'left', key: 'status', title: 'State', visible: true },
      { checked: false, fixed: 'unFixed', key: 'name', title: 'Full name', visible: true },
      { checked: true, fixed: 'unFixed', key: 'role', title: 'Role', visible: true }
    ]);
  });

  it('applies checked order and fixed state to Ant Design columns', () => {
    const columns = createUserColumns();
    const result = getAntdColumns(columns, [
      { checked: true, fixed: 'left', key: 'status', title: 'Status', visible: true },
      { checked: false, fixed: 'unFixed', key: 'name', title: 'Name', visible: true }
    ]);

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ dataIndex: 'status', fixed: 'left', key: 'status' });
  });
});

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false
      }
    }
  });
}

function createWrapper(client: QueryClient) {
  const Wrapper = (props: HookWrapperProps) => {
    const { children } = props;

    return <TestQueryProvider client={client}>{children}</TestQueryProvider>;
  };

  return Wrapper;
}

function createUserColumns(): UserTableColumn[] {
  return [
    { dataIndex: 'name', key: 'name', title: 'Name' },
    { dataIndex: 'status', key: 'status', title: 'Status' }
  ];
}

async function createEmptyUserResponse(params: UserSearchParams): Promise<PaginatingQueryRecord<UserRecord>> {
  return {
    current: params.current,
    records: [],
    size: params.size,
    total: 0
  };
}

function createUserQueryHook(
  apiFn: (params: UserSearchParams) => Promise<PaginatingQueryRecord<UserRecord>>
) {
  return function useUserQuery<Data = PaginatingQueryRecord<UserRecord>>(
    params: UserSearchParams,
    options?: TableQueryHookOptions<PaginatingQueryRecord<UserRecord>, Data>
  ) {
    return useQuery({
      ...options,
      queryFn: () => apiFn(params),
      queryKey: ['users', params]
    });
  };
}
