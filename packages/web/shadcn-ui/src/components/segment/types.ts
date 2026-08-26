import type { TabsOptionData, TabsProps } from '../tabs/types';

/**
 * Data structure for a single segment option in the segment control.
 * Extends TabsOptionData but removes the children property since segments
 * typically do not display content panels like tabs do.
 */
export type SegmentOptionData = Omit<TabsOptionData, 'children'>;

/**
 * Props for the Segment Control component.
 * A segmented control (also known as segmented button group) for selecting one option
 * from multiple mutually exclusive choices.
 *
 * @template T - Type of segment option data, defaults to SegmentOptionData
 *
 * @example
 * ```tsx
 * <Segment
 *   items={[
 *     { value: "day", label: "Day" },
 *     { value: "week", label: "Week" },
 *     { value: "month", label: "Month" }
 *   ]}
 *   defaultValue="day"
 * />
 * ```
 */
export type SegmentProps<T extends SegmentOptionData = SegmentOptionData> = Omit<
  TabsProps<TabsOptionData>,
  'contentProps' | 'forceMountContent' | 'items' | 'renderContent' | 'renderTrigger'
> & {
  /**
   * Array of segment options to display.
   * Each option represents a selectable segment button.
   */
  items: T[];
};
