import type {
  TabsContentProps as _TabsContentProps,
  TabsListProps as _TabsListProps,
  TabsProps as _TabsRootProps,
  TabsTriggerProps as _TabsTriggerProps
} from '@radix-ui/react-tabs';
import type { ClassValue, StyledComponentProps, ThemeOrientation } from '../../types/shared';
import type { TabsFill, TabsSlots, TabsType } from './tabs-variants';

export type TabsShape = 'rounded' | 'square';

/**
 * Represents the visual style properties of the indicator.
 * Used to position and size the active tab indicator element.
 *
 * @example
 * ```tsx
 * const indicator: IndicatorStyle = {
 *   position: 0,      // Pixel offset from the left
 *   size: 100         // Width of the indicator in pixels
 * }
 * ```
 */
export interface IndicatorStyle {
  /**
   * The horizontal position (in pixels) where the indicator should be placed.
   * Null when no indicator is visible.
   */
  position: number | null;
  /**
   * The width (in pixels) of the indicator element.
   * Null when no indicator is visible.
   */
  size: number | null;
}

/**
 * Class names for different slots in the tabs component.
 * Allows customizing styles for specific parts of the tabs (root, triggers, content, indicator, etc.).
 *
 * @example
 * ```tsx
 * const classNames: TabsUi = {
 *   root: 'custom-root',
 *   list: 'custom-list',
 *   indicator: 'custom-indicator'
 * }
 * ```
 */
export type TabsUi = Partial<Record<TabsSlots, ClassValue>>;

/**
 * Props for the tabs root component.
 * Configures the main tabs container with fill style options.
 */
export interface TabsRootProps extends StyledComponentProps<_TabsRootProps> {
  /**
   * Determines how the tabs fill the available space.
   * Controls the layout style (e.g., fixed width, expand to fill, etc.).
   */
  fill?: TabsFill;
}

/**
 * Props for the tabs list component.
 * Wraps the individual tab triggers and manages the indicator.
 *
 * @example
 * ```tsx
 * <TabsList
 *   value="tab-1"
 *   enableIndicator={true}
 *   orientation="horizontal"
 *   classNames={{ indicator: 'custom-indicator' }}
 * />
 * ```
 */
export interface TabsListProps extends StyledComponentProps<_TabsListProps>, Pick<_TabsRootProps, 'value'> {
  /**
   * Class names for customizing the indicator and its container.
   */
  classNames?: Pick<TabsUi, 'indicator' | 'indicatorRoot'>;
  /**
   * Whether to display an animated indicator under the active tab.
   * Defaults to false.
   */
  enableIndicator?: boolean;
  /**
   * The direction of the tabs layout (horizontal or vertical).
   */
  orientation?: ThemeOrientation;
  /**
   * The shape of the tabs list.
   */
  shape?: TabsShape;
  /**
   * The visual style type of the tabs.
   */
  type?: TabsType;
}

/**
 * Props for the tabs trigger component.
 * Represents a single clickable tab button.
 */
export interface TabsTriggerProps extends StyledComponentProps<Omit<_TabsTriggerProps, 'className' | 'type'>> {
  /**
   * Whether to display an animated indicator under this trigger when active.
   * Overrides the list-level indicator setting if specified.
   */
  enableIndicator?: boolean;
  /**
   * The visual style type of the tabs.
   */
  type?: TabsType;
}

/**
 * Props for the tabs content component.
 * Wraps the content displayed when a tab is active.
 *
 * @example
 * ```tsx
 * <TabsContent
 *   value="tab-1"
 *   orientation="horizontal"
 * >
 *   Content for tab 1
 * </TabsContent>
 * ```
 */
export interface TabsContentProps extends StyledComponentProps<Omit<_TabsContentProps, 'className'>> {
  /**
   * The direction of the content layout (horizontal or vertical).
   */
  orientation?: ThemeOrientation;
}

/**
 * Data structure for a single tabs item when using the data-driven approach.
 * Use this type to define items passed to the `items` prop of the Tabs component.
 *
 * @example
 * ```tsx
 * const items: TabsOptionData[] = [
 *   {
 *     value: 'tab-1',
 *     label: 'Tab 1',
 *     children: 'Content 1',
 *     disabled: false
 *   }
 * ]
 * ```
 */
export type TabsOptionData = Pick<TabsTriggerProps, 'disabled'> & {
  /**
   * The content to display when this tab is active.
   * Can be a static ReactNode or a render function that receives active state and item data.
   */
  children: React.ReactNode;
  /**
   * The label/title displayed in the tab trigger button.
   */
  label: React.ReactNode;
  /**
   * Unique identifier for this tab.
   * Used to associate triggers with content and maintain tab state.
   */
  value: string;

};

/**
 * Props for the main Tabs component.
 * Supports data-driven rendering via the `items` prop.
 *
 * @template T - Type of tab item data, defaults to TabsOptionData
 *
 * @example
 * ```tsx
 * const items = [
 *   { value: 'tab-1', label: 'Tab 1', children: 'Content 1' },
 *   { value: 'tab-2', label: 'Tab 2', children: 'Content 2' }
 * ]
 *
 * <Tabs
 *   items={items}
 *   defaultValue="tab-1"
 *   enableIndicator={true}
 *   classNames={{ indicator: 'custom-indicator' }}
 * />
 * ```
 */
export interface TabsProps<T extends TabsOptionData = TabsOptionData> extends TabsRootProps, Pick<TabsListProps, 'enableIndicator' | 'loop' | 'orientation' | 'shape' | 'type'> {
  /**
   * Class names for customizing different slots of the tabs component.
   */
  classNames?: TabsUi;
  /**
   * Props for the tabs content component.
   */
  contentProps?: TabsContentProps;
  /**
   * Whether to disable the tabs component.
   */
  disabled?: boolean;
  /**
   * Whether to display an animated indicator under the active tab.
   */
  enableIndicator?: boolean;
  /**
   * Whether to force mount all tab content even when inactive.
   * Useful for preserving component state across tab switches.
   */
  forceMountContent?: true;
  /**
   * Array of tab items to render.
   * Each item should have a unique `value` property.
   */
  items: T[];
  /**
   * Props for the tabs list component.
   */
  listProps?: TabsListProps;
  /**
   * Render function for the content of the tab.
   */
  renderContent?: (props: { active: boolean; item: TabsOptionData }) => React.ReactNode;
  /**
   * Render function for the trigger of the tab.
   */
  renderTrigger?: (props: { active: boolean; item: TabsOptionData }) => React.ReactNode;
  /**
   * Props for the tabs trigger component.
   */
  triggerProps?: Partial<TabsTriggerProps>;
};
