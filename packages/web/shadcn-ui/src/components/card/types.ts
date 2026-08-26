import type { ReactNode } from 'react';
import type { ClassValue, ThemeSize, WithClassName } from '../../types/shared';
import type { CardSlots } from './card-variants';

/**
 * Props for the Card root component.
 * Main container for card content with size and layout options.
 */
export interface CardRootProps
  extends WithClassName,
  Omit<React.HTMLAttributes<HTMLDivElement>, 'className' | 'title'> {
  /**
   * The size variant of the card affecting padding and spacing.
   */
  size?: ThemeSize;
  /**
   * If true, splits the card layout into distinct sections visually.
   */
  split?: boolean;
}

/**
 * Props for the Card header component.
 * Container for the card's top section, typically containing title and extra content.
 */
export interface CardHeaderProps
  extends WithClassName,
  Omit<React.HTMLAttributes<HTMLDivElement>, 'className' | 'title'> {
  /**
   * The size variant of the header affecting padding and typography.
   */
  size?: ThemeSize;
}

/**
 * Props for the CardTitle root wrapper component.
 * Container for the title and optional leading/trailing icons or content.
 */
export interface CardTitleRootProps
  extends WithClassName,
  Omit<React.HTMLAttributes<HTMLDivElement>, 'className' | 'title'> {
  /**
   * Content or icon displayed before the title text.
   */
  leading?: React.ReactNode;
  /**
   * The size variant of the title container affecting spacing.
   */
  size?: ThemeSize;
  /**
   * Content or icon displayed after the title text.
   */
  trailing?: React.ReactNode;
}

/**
 * Props for the Card title component.
 * Displays the main heading or title text of the card.
 */
export interface CardTitleProps
  extends WithClassName,
  Omit<React.HTMLAttributes<HTMLDivElement>, 'className' | 'title'> {
  /**
   * The size variant of the title text.
   */
  size?: ThemeSize;
}

/**
 * Props for the Card footer component.
 * Container for the card's bottom section, typically containing action buttons.
 */
export interface CardFooterProps
  extends WithClassName,
  Omit<React.HTMLAttributes<HTMLDivElement>, 'className' | 'title'> {
  /**
   * The size variant of the footer affecting padding and spacing.
   */
  size?: ThemeSize;
}

/**
 * Props for the Card content component.
 * Main content area of the card.
 */
export interface CardContentProps
  extends WithClassName,
  Omit<React.HTMLAttributes<HTMLDivElement>, 'className' | 'title'> {
/**
 * If true, the card content will be scrollable.
 * When true, adds overflow-auto to the content wrapper.
 * @default true
 */
  scrollable?: boolean;
  /**
   * The size variant of the content affecting padding.
   */
  size?: ThemeSize;
}

/**
 * Class names for different slots in the card component.
 * Allows customizing styles for specific parts of the card.
 */
export type CardUi = Partial<Record<CardSlots, ClassValue>>;

/**
 * Props for the main Card component.
 * A flexible container component that combines header, title, content, and footer sections.
 *
 * @example
 * ```jsx
 * <Card
 *   size="md"
 *   split={false}
 *   flexHeight={true}
 *   title="Card Title"
 *   titleLeading={<IconComponent />}
 *   header={<CustomHeader />}
 *   footer={<Button>Action</Button>}
 * >
 *   Card content goes here
 * </Card>
 * ```
 */
export interface CardProps extends CardRootProps {
  /**
   * Class names for customizing different parts of the card.
   */
  classNames?: CardUi;
  /**
   * Props for the card content component.
   */
  contentProps?: CardContentProps;
  /**
   * Extra content displayed in the header area, typically alongside the title.
   */
  extra?: ReactNode;
  /**
   * Custom footer content rendered at the bottom of the card.
   */
  footer?: ReactNode;
  /**
   * Props for the card footer component.
   */
  footerProps?: CardFooterProps;
  /**
   * Custom header content rendered at the top of the card.
   * Overrides default header if provided.
   */
  header?: ReactNode;
  /**
   * Props for the card header component.
   */
  headerProps?: CardHeaderProps;
  /**
   * If true, the card content will be scrollable.
   * When true, adds overflow-auto to the content wrapper.
   * @default true
   */
  scrollable?: boolean;
  /**
   * Main title text displayed in the card header.
   */
  title?: ReactNode;
  /**
   * Content displayed before the title in the title section.
   */
  titleLeading?: ReactNode;
  /**
   * Props for the card title component.
   */
  titleProps?: CardTitleProps;
  /**
   * Custom root wrapper for the title and optional leading/trailing content.
   */
  titleRoot?: ReactNode;
  /**
   * Props for the card title root component.
   */
  titleRootProps?: CardTitleRootProps;
  /**
   * Content displayed after the title in the title section.
   */
  titleTrailing?: ReactNode;
}
