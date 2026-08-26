// ---------------------------------------------------------------------------
// Composed components without a config-aware wrapper.
// Re-exported by name to avoid leaking internal sub-parts (Root / Trigger /
// Item / Indicator ...). Internal sub-parts remain reachable via the
// `@skyroc/web-ui/primitives` subpath.
// ---------------------------------------------------------------------------

export { Arrow, type ArrowProps } from '../components/arrow';
export { Menubar, type MenubarOption, type MenubarProps } from '../components/menubar';
export {
  NavigationMenu,
  type NavigationMenuItemBaseOption,
  type NavigationMenuItemChildOption,
  type NavigationMenuItemOption,
  type NavigationMenuLinkBaseOption,
  type NavigationMenuProps
} from '../components/navigation-menu';
export {
  type ResizableClassNames,
  ResizableHandle,
  type ResizableHandleProps,
  ResizablePanel,
  ResizablePanelGroup,
  type ResizablePanelGroupProps
} from '../components/resizable';
export {
  Skeleton,
  type SkeletonAnimation,
  SkeletonContainer,
  type SkeletonContainerProps,
  type SkeletonProps
} from '../components/skeleton';
export {
  ToggleGroup,
  type ToggleGroupClassNames,
  type ToggleGroupItemData,
  type ToggleGroupProps
} from '../components/toggle-group';
export {
  useVirtualizer,
  useWindowVirtualizer,
  VirtualGrid,
  type VirtualGridProps,
  type VirtualizerBaseOptions,
  type VirtualizerClassNames,
  type VirtualizerGrid,
  type VirtualizerList,
  type VirtualizerProps,
  VirtualList,
  type VirtualListItem,
  type VirtualListProps
} from '../components/virtualizer';

// ---------------------------------------------------------------------------
// Config-aware preset wrappers
// ---------------------------------------------------------------------------

export * from './accordion';
export * from './alert';
export * from './alert-dialog';
export * from './aspect-ratio';
export * from './avatar';
export * from './badge';
export * from './bottom-sheet';
export * from './breadcrumb';
export * from './button';
export * from './card';
export * from './carousel';
export * from './checkbox';
export * from './collapsible';
export * from './command';
export * from './config-provider';
export * from './context-menu';
export * from './dialog';
export * from './divider';
export * from './drawer';
export * from './dropdown-menu';
export * from './form';
export * from './hover-card';
export * from './icon';
export * from './input';
export * from './input-otp';
export * from './keyboard-key';
export * from './label';
export * from './layout';
export * from './list';
export * from './number-input';
export * from './pagination';
export * from './password';
export * from './popover';
export * from './progress';
export * from './radio';
export * from './scroll-area';
export * from './segment';
export * from './select';
export * from './slider';
export * from './sonner';
export * from './switch';
export * from './tabs';
export * from './tag';
export * from './textarea';
export * from './toggle';
export * from './tooltip';
export * from './tree';
