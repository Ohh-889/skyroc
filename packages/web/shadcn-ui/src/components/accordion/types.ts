import type {
  AccordionContentProps as _AccordionContentProps,
  AccordionHeaderProps as _AccordionHeaderProps,
  AccordionItemProps as _AccordionItemProps,
  AccordionMultipleProps,
  AccordionSingleProps,
  AccordionTriggerProps as _AccordionTriggerProps
} from '@radix-ui/react-accordion';
import type { ClassValue, SlotProps, StyledComponentProps, ThemeSize } from '../../types/shared';
import type { AccordionSlots } from './accordion-variants';

/**
 * Class names for different slots in the accordion component.
 * Allows customizing styles for specific parts of the accordion.
 */
export type AccordionClassNames = Partial<Record<AccordionSlots, ClassValue>>;

/**
 * Props for the accordion root component.
 * Can be either single or multiple selection mode.
 */
export type AccordionRootProps = StyledComponentProps<AccordionSingleProps> | StyledComponentProps<AccordionMultipleProps>;

/**
 * Props for the accordion header component.
 * Wraps the trigger button for each accordion item.
 */
export interface AccordionHeaderProps extends StyledComponentProps<_AccordionHeaderProps> {}

/**
 * Props for the accordion content component.
 * Contains the expandable/collapsible content for each item.
 */
export interface AccordionContentProps extends StyledComponentProps<_AccordionContentProps> {}

/**
 * Props for the accordion item component.
 * Represents a single expandable section in the accordion.
 */
export interface AccordionItemProps extends StyledComponentProps<_AccordionItemProps> {}

/**
 * Props for the accordion trigger component.
 * The clickable button that toggles the accordion item.
 */
export interface AccordionTriggerProps extends StyledComponentProps<_AccordionTriggerProps>, SlotProps {
  /**
   * Class names for customizing trigger icon slots.
   */
  classNames?: Pick<AccordionClassNames, 'triggerIcon' | 'triggerLeadingIcon'>;
  /**
   * Custom icon to display in the trigger (typically a chevron/arrow).
   */
  icon?: React.ReactNode;
}

/**
 * Data structure for a single accordion item when using the data-driven approach.
 * Use this type to define items passed to the `items` prop of the Accordion component.
 */
export interface AccordionItemData extends Pick<AccordionItemProps, 'disabled' | 'value'> {
  /**
   * The content to display when the accordion item is expanded.
   */
  children: React.ReactNode;
  /**
   * Optional content to display before the title in the trigger.
   */
  leading?: React.ReactNode;
  /**
   * The title/label shown in the accordion trigger button.
   */
  title: React.ReactNode;
  /**
   * Optional content to display after the title in the trigger.
   */
  trailing?: React.ReactNode;
}

/**
 * Props for the main Accordion component.
 * Supports data-driven rendering via the `items` prop.
 *
 * @template T - Type of accordion item data, defaults to AccordionItemData
 */
export type AccordionProps<T extends AccordionItemData = AccordionItemData> = AccordionRootProps & {
  /**
   * Class names for customizing different parts of the accordion.
   */
  classNames?: AccordionClassNames;
  /**
   * Props for the accordion content component.
   */
  contentProps?: AccordionContentProps;
  /**
   * Props for the accordion header component.
   */
  headerProps?: AccordionHeaderProps;
  /**
   * Props for the accordion item component.
   */
  itemProps?: AccordionItemProps;
  /**
   * Array of accordion items to render.
   * Each item should have a unique `value` property.
   */
  items: T[];
  /**
   * Size variant for the accordion (affects spacing and typography).
   */
  size?: ThemeSize;
  /**
   * Default icon to display in all triggers (can be overridden per item).
   */
  triggerIcon?: React.ReactNode;

  /**
   * Default leading content for all triggers (can be overridden per item).
   */
  triggerLeading?: React.ReactNode;

  /**
   * Props for the accordion trigger component.
   */

  /**
   * Props for the accordion item component.
   */
  triggerProps?: AccordionTriggerProps;

  /**
   * Default trailing content for all triggers (can be overridden per item).
   */
  triggerTrailing?: React.ReactNode;
};
