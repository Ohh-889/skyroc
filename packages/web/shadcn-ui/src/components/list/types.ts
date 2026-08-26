import type { ComponentPropsWithRef, ReactNode } from 'react';
import type { ClassValue, SlotProps, StyledComponentProps, ThemeSize } from '../../types/shared';
import type { ListSlots } from './list-variants';

/**
 * Props for the List root component.
 * Main container for list items.
 */
export interface ListRootProps extends StyledComponentProps<ComponentPropsWithRef<'ul'>> {
  /**
   * The size variant of the list affecting spacing and typography.
   */
  size?: ThemeSize;
}

/**
 * Props for the List item component.
 * Individual list item container.
 */
export interface ListItemProps extends StyledComponentProps<ComponentPropsWithRef<'li'>> {
  /**
   * The size variant of the list item affecting spacing.
   */
  size?: ThemeSize;
}

/**
 * Props for the List content component.
 * Container for the main content area within a list item.
 */
export interface ListContentProps extends StyledComponentProps<ComponentPropsWithRef<'div'>> {
  /**
   * The size variant of the content affecting spacing.
   */
  size?: ThemeSize;
}

/**
 * Props for the List title component.
 * Displays the title text within a list item.
 */
export interface ListTitleProps extends StyledComponentProps<ComponentPropsWithRef<'h3'>> {
  /**
   * The size variant of the title text.
   */
  size?: ThemeSize;
}

/**
 * Props for the List description component.
 * Displays the description text within a list item.
 */
export interface ListDescriptionProps extends StyledComponentProps<ComponentPropsWithRef<'p'>> {
  /**
   * The size variant of the description text.
   */
  size?: ThemeSize;
}

/**
 * Class names for different slots in the list component.
 * Allows customizing styles for specific parts of the list.
 */
export type ListUi = Partial<Record<ListSlots, ClassValue>>;

/**
 * Props for the main List component.
 * A flexible list component that combines root, item, content, title, and description sections.
 *
 * @example
 * ```jsx
 * <List size="md">
 *   <ListItem
 *     title="Item Title"
 *     description="Item description"
 *     leading={<Icon />}
 *     trailing={<ChevronIcon />}
 *   >
 *     Additional content
 *   </ListItem>
 * </List>
 * ```
 */
export interface ListProps extends ListRootProps, Pick<ListItemUIProps, 'contentProps' | 'descriptionProps' | 'titleProps'>, SlotProps {
  /**
   * Class names for customizing different parts of the list.
   */
  classNames?: ListUi;

  /**
   * Array of list items to render.
   */
  items: ListItemUIProps[];
}

/**
 * Props for the ListItemUI component.
 * A composite list item with leading, content, and trailing areas.
 */
export interface ListItemUIProps extends Omit<ListItemProps, 'children' | 'content' | 'title'> {
  /**
   * Class names for customizing different parts of the list item.
   */
  classNames?: ListUi;
  /**
   * Main content area for the list item.
   * Displayed after title and description.
   */
  content?: ReactNode;
  /**
   * Props for the list content component.
   */
  contentProps?: ListContentProps;
  /**
   * Description text for the list item.
   */
  description?: ReactNode;
  /**
   * Props for the list description component.
   */
  descriptionProps?: ListDescriptionProps;
  /**
   * Custom divider element to display between list items.
   * If not provided, a default divider will be used when divider is true.
   */
  divider?: ReactNode | boolean;
  /**
   * Content displayed at the start of the list item (e.g., avatar, thumbnail).
   */
  leading?: ReactNode;
  /**
   * Title text for the list item.
   */
  title?: ReactNode;
  /**
   * Props for the list title component.
   */
  titleProps?: ListTitleProps;
  /**
   * Content displayed at the end of the list item (e.g., action buttons, badge).
   */
  trailing?: ReactNode;
}
