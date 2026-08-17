import { createContext } from 'react';
import type { CollapseContextValue } from './types';

/** Context for Collapse to communicate with child CollapseItem components */
const CollapseContext = createContext<CollapseContextValue | undefined>(undefined);

/**
 * 面板序号，由 Collapse 按子元素顺序逐个下发。
 *
 * 未显式传 `name` 时用作默认标识，同时决定首项之外是否绘制顶部分隔线。 只对 Collapse 的直接子元素生效，套了一层容器的面板请显式传 `name`。
 */
const CollapseIndexContext = createContext(0);

export { CollapseContext, CollapseIndexContext };
