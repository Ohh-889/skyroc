import type { ClassValue } from 'clsx';
import type { ReactNode } from 'react';

export type { MaybeArray } from '@skyroc/utils/type';

// 三端共用的组件词汇表，单一数据源在设计令牌包里
export type { ThemeAlign, ThemeColor, ThemeOrientation, ThemeSide, ThemeSize, Value } from '@skyroc/tailwind-plugin/ui';

export type { ClassValue };

/** 带 className 的 props */
export interface WithClassName {
  /** CSS class name */
  className?: ClassValue;
}

// ==================== Web-Specific Types ====================

/** HTML element tag types */
export type HTMLTag =
  | 'a'
  | 'button'
  | 'div'
  | 'form'
  | 'h2'
  | 'h3'
  | 'img'
  | 'input'
  | 'label'
  | 'li'
  | 'nav'
  | 'ol'
  | 'p'
  | 'span'
  | 'svg'
  | 'ul'
  | 'template'
  | ({} & string);

/** Props for primitive components with polymorphic rendering */
export interface PrimitiveProps {
  /**
   * The element or component this component should render as. Can be overwritten by `asChild`
   *
   * @defaultValue 'div'
   */
  as?: HTMLTag | ReactNode;
  /**
   * Change the default rendered element for the one passed as a child, merging their props and behavior.
   *
   * Read our [Composition](https://www.skyroc-ui.com/docs/guides/composition) guide for more details.
   */
  asChild?: boolean;
}

/** Base props for styled components with className and size support */
export type StyledComponentProps<T> = Omit<T, 'className'> & {
  /** CSS class name */
  className?: ClassValue;
  /** Component size variant */
  size?: import('@skyroc/tailwind-plugin/ui').ThemeSize;
};

/** Props for components with leading and trailing slots */
export interface SlotProps {
  /** Leading slot content */
  leading?: ReactNode;
  /** Trailing slot content */
  trailing?: ReactNode;
}

/** Props for HTML intrinsic elements with styling support */
export type HTMLComponentProps<T extends keyof React.JSX.IntrinsicElements> = StyledComponentProps<
  React.ComponentPropsWithRef<T>
>;
