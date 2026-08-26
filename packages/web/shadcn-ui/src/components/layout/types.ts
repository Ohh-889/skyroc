import type { ReactNode } from 'react';
import type { ClassValue, StyledComponentProps, ThemeSize } from '../../types/shared';
import type { DrawerSide } from '../drawer';
import type { LayoutCollapsible, LayoutSide, LayoutSlots, LayoutVariant } from './layout-variants';

/**
 * Props for the Layout main content area.
 * Renders the primary content section of the layout.
 *
 * @example
 * <LayoutMain variant="sidebar" collapsible="icon">
 *   Main content goes here
 * </LayoutMain>
 */
export type LayoutMainProps = Pick<StyledComponentProps<'main'>, 'className'> & {
  /** Content to render within the main area */
  children?: ReactNode;
  /** Whether the main area content is collapsible */
  collapsible?: LayoutCollapsible;
  /** Layout variant that affects main area styling */
  variant?: LayoutVariant;
};

/**
 * Class names for different slots in the layout component.
 * Allows customizing styles for specific parts of the layout.
 */
export type LayoutClassNames = Partial<Record<LayoutSlots, ClassValue>>;

/**
 * Props for the Layout header section.
 * Renders a fixed or sticky header at the top of the layout.
 *
 * @example
 * <LayoutHeader>
 *   <h1>Page Title</h1>
 * </LayoutHeader>
 */
export type LayoutHeaderProps = Pick<StyledComponentProps<'header'>, 'className'> & {
  /** Header content to render */
  children?: ReactNode;
};

/**
 * Props for the Layout tab section.
 * Renders a tab area below the header in the layout.
 *
 * @example
 * <LayoutTab>
 *   <Tabs>Tab content</Tabs>
 * </LayoutTab>
 */
export type LayoutTabProps = Pick<StyledComponentProps<'div'>, 'className'> & {
  /** Tab content to render */
  children?: ReactNode;
};

/**
 * Props for the Layout footer section.
 * Renders a footer area at the bottom of the layout.
 *
 * @example
 * <LayoutFooter>
 *   <p>Footer content</p>
 * </LayoutFooter>
 */
export type LayoutFooterProps = Pick<StyledComponentProps<'footer'>, 'className'> & {
  /** Footer content to render */
  children?: ReactNode;
};

/**
 * Props for the Layout mobile sidebar.
 * Renders a mobile-responsive sidebar using the Sheet component.
 *
 * @example
 * <LayoutMobile side="left" rootClassName="mobile-only">
 *   Mobile navigation
 * </LayoutMobile>
 */
export type LayoutMobileProps = Pick<StyledComponentProps<'div'>, 'className'> & {
  /** Content to render in the mobile sidebar */
  children?: ReactNode;
  /** Class names for the root element of mobile layout */
  rootClassName?: ClassValue;
  /** Position of the mobile sidebar (left or right) */
  side?: DrawerSide;
};

/**
 * Props for the Layout rail sidebar.
 * Renders a vertical navigation rail, typically on desktop.
 *
 * @example
 * <LayoutRail side="left" variant="sidebar" collapsible="icon">
 *   <nav>Navigation items</nav>
 * </LayoutRail>
 */
export type LayoutRailProps = Pick<StyledComponentProps<'div'>, 'className'> & {
  /** Whether the rail is collapsible */
  collapsible?: LayoutCollapsible;
  /** Position of the rail (left or right) */
  side?: LayoutSide;
  /** Rail variant that affects styling */
  variant?: LayoutVariant;
};

type LayoutUi = Partial<Record<LayoutSlots, ClassValue>>;

/**
 * Props passed to the sidebar render function.
 * Provides context information about the current sidebar state.
 */
export interface LayoutSidebarChildrenProps {
  /** Whether the sidebar is currently collapsed */
  collapsed: boolean;
  /** Current width of the sidebar when collapsed */
  collapsedWidth?: number;
  /** Size variant of the sidebar */
  size?: ThemeSize;
}

/**
 * Props for the Layout sidebar section.
 * Renders a collapsible sidebar with optional render function support.
 *
 * @example
 * <LayoutSidebar side="left" collapsible="offcanvas">
 *   Sidebar content
 * </LayoutSidebar>
 *
 * @example
 * // Using render function to respond to sidebar state changes
 * <LayoutSidebar>
 *   {({ collapsed, size }) => (
 *     <nav className={collapsed ? 'icon-only' : 'full'}>
 *       Navigation items
 *     </nav>
 *   )}
 * </LayoutSidebar>
 */
export type LayoutSidebarProps = Pick<StyledComponentProps<'div'>, 'className'> & {
  /** Sidebar content or render function that receives sidebar state */
  children?: ReactNode | ((props: LayoutSidebarChildrenProps) => ReactNode);
  /** Whether the sidebar is collapsible */
  collapsible?: LayoutCollapsible;
  /** Position of the sidebar (left or right) */
  side?: LayoutSide;
  /** Size variant of the sidebar */
  size?: ThemeSize;
  /** Custom styling for layout slots */
  ui?: LayoutUi;
  /** Sidebar variant that affects styling */
  variant?: LayoutVariant;
};

/**
 * Props for the Layout toggle/trigger button.
 * Button component for toggling sidebar open/closed state.
 *
 * @example
 * <LayoutTrigger onClick={() => toggleSidebar()}>
 *   Menu
 * </LayoutTrigger>
 */
export type LayoutTriggerProps = Omit<StyledComponentProps<React.ComponentPropsWithRef<'button'>>, 'color' | 'size'> & {
  /** Size variant for the trigger button */
  size?: ThemeSize;
};

/**
 * Props passed to the root layout render function.
 * Provides context information about the layout state.
 */
export interface LayoutRootChildrenProps {
  /** Whether the layout sidebar is currently open */
  open: boolean;
}

/**
 * Props for the Layout root component.
 * Main container component that manages the layout state and structure.
 *
 * @example
 * <LayoutRoot
 *   collapsible="offcanvas"
 *   defaultOpen={true}
 *   sidebarWidth={250}
 *   collapsedSidebarWidth={60}
 * >
 *   {({ open }) => <div>Layout is {open ? 'open' : 'closed'}</div>}
 * </LayoutRoot>
 */
export type LayoutRootProps = Pick<StyledComponentProps<'div'>, 'className'> & {
  /** Root content or render function that receives layout state */
  children?: ReactNode | ((props: LayoutRootChildrenProps) => ReactNode);
  /** The width of the sidebar when it's collapsed */
  collapsedSidebarWidth?: number;
  /** Whether the sidebar is collapsible */
  collapsible?: LayoutCollapsible;
  /** The default open state of the sidebar */
  defaultOpen?: boolean;
  /** Callback when the open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Whether the sidebar is open */
  open?: boolean;
  /** The side of the layout (left or right) */
  side?: LayoutSide;
  /** The width of the sidebar when expanded */
  sidebarWidth?: number;
  /** The size of the layout */
  size?: ThemeSize;
  /** The variant of the layout */
  variant?: LayoutVariant;
};

/**
 * Props for the main Layout component.
 * Composite component that manages header, sidebar, tab, footer and main content areas.
 *
 * @example
 * <Layout
 *   variant="sidebar"
 *   collapsible="icon"
 *   side="left"
 *   header={<LayoutHeader>Header</LayoutHeader>}
 *   sidebar={<LayoutSidebar>Sidebar</LayoutSidebar>}
 *   tab={<LayoutTab>Tab</LayoutTab>}
 *   footer={<LayoutFooter>Footer</LayoutFooter>}
 * >
 *   Main content area
 * </Layout>
 */
export type LayoutProps = Omit<LayoutRootProps, 'children'> & {
  /** Main content area of the layout */
  children?: ReactNode;
  /** Footer content of the layout */
  footer?: ReactNode;
  /** Header content of the layout */
  header?: ReactNode;
  /** Sidebar content or render function */
  sidebar?: ReactNode | ((props: LayoutSidebarChildrenProps) => ReactNode);
  /** Tab content of the layout */
  tab?: ReactNode;
  /** Custom styling for layout slots */
  ui?: LayoutUi;
};

type SidebarState = 'collapsed' | 'expanded';

/**
 * Context type for the Layout component.
 * Provides layout state and control methods to child components.
 */
export interface LayoutContextType {
  /** Current width of the sidebar when collapsed */
  collapsedSidebarWidth?: number;
  /** Whether the layout is in mobile view */
  isMobile: boolean;
  /** Callback to change the sidebar open state */
  onOpenChange: (open: boolean) => void;
  /** Callback to change the mobile sidebar open state */
  onOpenMobileChange: (open: boolean) => void;
  /** Whether the desktop sidebar is open */
  open: boolean;
  /** Whether the mobile sidebar is open */
  openMobile: boolean;
  /** Current width of the sidebar when expanded */
  sidebarWidth?: number;
  /** Current state of the sidebar (collapsed or expanded) */
  state: SidebarState;
  /** Function to toggle the sidebar open/closed state */
  toggleSidebar: () => void;
}
