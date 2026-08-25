/**
 * 三端 UI 组件共用的 props 词汇表，从 `@skyroc/tailwind-plugin/ui` 导入。
 *
 * 放在本包是因为这里已经是设计令牌的单一数据源（见 `tokens.ts`）：`ThemeColor` 直接
 * 复用插件生成 CSS 变量时用的 {@link SemanticColorName}，两边不会再各写一份而漂移。
 *
 * 本文件零 import，`./ui` 子入口也不会牵出 tailwindcss / @unocss/core —— 只要类型的
 * 组件库可以放心引它。
 */
import type { SemanticColorName } from './tokens';

/**
 * 组件的语义色变体。
 *
 * 与插件产出的 CSS 变量键名一一对应，因此直接复用令牌侧的定义，不另写联合类型。
 */
export type ThemeColor = SemanticColorName;

/**
 * 组件的尺寸档位。
 *
 * 刻意不复用 `tokens.ts` 的 {@link FontSizeToken}：那是字号尺度（中档叫 `base`），
 * 这里是组件尺寸档位（中档叫 `md`），两者的语义和取值都不一样。
 */
export type ThemeSize = '2xl' | 'lg' | 'md' | 'sm' | 'xl' | 'xs';

/** 主轴方向 */
export type ThemeOrientation = 'horizontal' | 'vertical';

/** 交叉轴对齐 */
export type ThemeAlign = 'center' | 'end' | 'start';

/** 相对目标元素的出现方位 */
export type ThemeSide = 'bottom' | 'left' | 'right' | 'top';

/** 表单控件的值标识 */
export type Value = string;
