import { Outlet, createFileRoute } from '@tanstack/react-router';

interface ManageSearchMiddlewareContext<TSearch extends object> {
  /** Continue the route search middleware chain. */
  next: (newSearch: TSearch) => TSearch;
  /** Current search object passed by TanStack Router. */
  search: TSearch;
}

const ManageLayout = () => {
  return <Outlet />;
};

export const Route = createFileRoute('/(admin)/manage')({
  component: ManageLayout,
  staticData: {
    i18nKey: 'route.manage',
    menu: {
      icon: 'material-symbols:manage-accounts-outline',
      order: 10,
      type: 'group'
    },
    permissions: ['R_ADMIN'],
    title: 'system-manage'
  },
  search: {
    middlewares: [stripManageSearchParams]
  }
});

function stripManageSearchParams<TSearch extends object>({
  next,
  search
}: ManageSearchMiddlewareContext<TSearch>): TSearch {
  const result = next(search);
  const entries = Object.entries(result).filter(([, value]) => {
    return !shouldStripManageSearchParam(value);
  });

  return Object.fromEntries(entries) as TSearch;
}

function shouldStripManageSearchParam(value: unknown) {
  return value === null || value === undefined || value === '';
}
