import { stringifyQuery } from '@skyroc/utils';
import { useMatches } from '@tanstack/react-router';

import { normalizePath } from './menus/menu-generator';

export function useRoute() {
  const route = useMatches({
    select: matches => {
      const m = matches[matches.length - 1];

      const qs = stringifyQuery(m.search);

      const fullPath = qs ? `${m.pathname}${qs}` : m.pathname;

      return {
        routeId: m.routeId,
        params: m.params,
        pathname: m.pathname,
        fullPath,
        staticData: m.staticData,
        searchStr: qs,
        originPath: normalizePath(m.fullPath) as Router.RoutePath,
        search: m.search
      };
    },
    structuralSharing: false
  });

  return route;
}
