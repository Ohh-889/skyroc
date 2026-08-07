import type { OperLogId } from './types';

export const MONITOR_OPERLOG_URLS = {
  CLEAN: '/monitor/operlog/clean',
  DELETE: (operIds: OperLogId[]) => `/monitor/operlog/${operIds.map(String).join(',')}`,
  EXPORT: '/monitor/operlog/export',
  LIST: '/monitor/operlog/list'
} as const;
