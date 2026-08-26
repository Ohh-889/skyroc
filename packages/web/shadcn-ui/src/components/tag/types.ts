import type { StyledComponentProps, ThemeColor } from '../../types/shared';
import type { TagShape, TagVariant } from './tag-variants';

/**
 * Props for the Tag component.
 * A small, styled label component used to highlight, categorize, or mark items.
 *
 * @example
 * ```jsx
 * <Tag color="primary" variant="solid" shape="pill">
 *   New
 * </Tag>
 * ```
 */
export interface TagProps extends StyledComponentProps<React.ComponentProps<'div'>> {
  /**
   * The color theme of the tag (e.g., primary, secondary, destructive, success, etc.).
   */
  color?: ThemeColor;
  /**
   * The shape variant of the tag (e.g., square, rounded, pill).
   */
  shape?: TagShape;
  /**
   * The visual style variant of the tag (e.g., solid, outline, subtle, ghost).
   */
  variant?: TagVariant;
}

export type { TagShape, TagVariant };
