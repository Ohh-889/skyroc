import { useContext } from 'react';
import { CollapseContext } from './CollapseContext';
import type { CollapseContextValue } from './types';

/** 读取 Collapse 上下文，缺失时直接抛错，避免脱离 Collapse 使用时静默渲染空内容 */
export function useCollapseContext(): CollapseContextValue {
  const context = useContext(CollapseContext);

  if (!context) {
    throw new Error('[Collapse] CollapseItem 必须在 Collapse 内部使用');
  }

  return context;
}
