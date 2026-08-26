import type { ThemeOptions } from '@skyroc/tailwind-plugin';
import type { ToasterProps } from 'sonner';
import type { ThemeSize } from '../../types/shared';
import type { AccordionProps } from '../../components/accordion/types';
import type { AlertProps } from '../../components/alert';
import type { AlertDialogProps } from '../../components/alert-dialog';
import type { AspectRatioProps } from '../../components/aspect-ratio';
import type { AvatarProps } from '../../components/avatar/types';
import type { BadgeProps } from '../../components/badge/types';
import type { BottomSheetProps } from '../../components/bottom-sheet';
import type { BreadcrumbItem, BreadcrumbProps } from '../../components/breadcrumb/types';
import type { ButtonProps } from '../../components/button/types';
import type { CardProps } from '../../components/card/types';
import type { CarouselProps } from '../../components/carousel/types';
import type { CheckboxProps } from '../../components/checkbox/types';
import type { CollapsibleProps } from '../../components/collapsible/types';
import type { CommandProps } from '../../components/command/types';
import type { ContextMenuProps } from '../../components/context-menu/types';
import type { DialogProps } from '../../components/dialog/types';
import type { DividerProps } from '../../components/divider/types';
import type { DrawerProps } from '../../components/drawer/types';
import type { DropdownMenuProps } from '../../components/dropdown-menu/types';
import type { FormFieldProps } from '../../components/form/types';
import type { HoverCardProps } from '../../components/hover-card/types';
import type { IconProps } from '../../components/icon';
import type { InputOTPProps } from '../../components/input-otp/types';
import type { InputProps } from '../../components/input/types';
import type { KeyboardKeyProps } from '../../components/keyboard-key/types';
import type { LabelProps } from '../../components/label/types';
import type { LayoutProps } from '../../components/layout/types';
import type { ListProps } from '../../components/list/types';
import type { MenuProps } from '../../components/menu/types';
import type { NumberInputProps } from '../../components/number-input/types';
import type { PaginationProps } from '../../components/pagination/types';
import type { PasswordProps } from '../../components/password/types';
import type { PopoverProps } from '../../components/popover/types';
import type { ProgressProps } from '../../components/progress/types';
import type { RadioGroupProps } from '../../components/radio/types';
import type { ScrollAreaProps } from '../../components/scroll-area/types';
import type { SegmentOptionData, SegmentProps } from '../../components/segment/types';
import type { SelectProps } from '../../components/select/types';
import type { SliderProps } from '../../components/slider/types';
import type { SwitchProps } from '../../components/switch/types';
import type { TabsOptionData, TabsProps } from '../../components/tabs/types';
import type { TagProps } from '../../components/tag/types';
import type { TextareaProps } from '../../components/textarea/types';
import type { ToggleProps } from '../../components/toggle/types';
import type { TooltipProps } from '../../components/tooltip/types';
import type { TreeProps } from '../../components/tree/types';

/**
 * Props for the ConfigProvider component. Provides global configuration and theming for all child components.
 *
 * @example
 *   ```tsx
 *   <ConfigProvider theme={{ primary: 'blue' }} direction="ltr" size="md">
 *     <App />
 *   </ConfigProvider>;
 *   ```
 */
export interface ConfigProviderProps extends ConfigProps {
  /** Child components that will inherit the configuration. */
  children: React.ReactNode;
}

/** Configuration options for the config provider. Controls global theme, direction, and default component sizes. */
export interface ConfigProps extends ComponentConfig {
  /**
   * Text direction for the entire application. Affects layout and text alignment for RTL languages.
   *
   * @default 'ltr'
   */
  direction?: 'ltr' | 'rtl';

  /** Default size variant for components. Can be overridden on individual components. */
  size?: ThemeSize;

  /** Theme configuration object. Defines colors, spacing, typography, and other design tokens. */
  theme?: ThemeOptions;
}

/** Component-specific configuration options. Allows setting default props for specific components globally. */
export interface ComponentConfig {
  /** Default configuration for accordion components. */
  accordion?: AccordionConfig;

  /** Default configuration for alert components. */
  alert?: AlertConfig;

  /** Default configuration for alert dialog components. */
  alertDialog?: AlertDialogConfig;

  /** Default configuration for aspect ratio components. */
  aspectRatio?: AspectRatioConfig;

  /** Default configuration for avatar components. */
  avatar?: AvatarConfig;

  /** Default configuration for badge components. */
  badge?: BadgeConfig;

  /** Default configuration for bottom sheet components. */
  bottomSheet?: BottomSheetConfig;

  /** Default configuration for breadcrumb components. */
  breadcrumb?: BreadcrumbConfig;

  /** Default configuration for button components. */
  button?: ButtonConfig;

  /** Default configuration for card components. */
  card?: CardConfig;

  /** Default configuration for carousel components. */
  carousel?: CarouselConfig;

  /** Default configuration for checkbox components. */
  checkbox?: CheckboxConfig;

  /** Default configuration for collapsible components. */
  collapsible?: CollapsibleConfig;

  /** Default configuration for command components. */
  command?: CommandConfig;

  /** Default configuration for context menu components. */
  contextMenu?: ContextMenuConfig;

  /** Default configuration for dialog components. */
  dialog?: DialogConfig;

  /** Default configuration for divider components. */
  divider?: DividerConfig;

  /** Default configuration for drawer components. */
  drawer?: DrawerConfig;

  /** Default configuration for dropdown menu components. */
  dropdownMenu?: DropdownMenuConfig;

  /** Default configuration for form field components. */
  formField?: FormFieldConfig;

  /** Default configuration for hover card components. */
  hoverCard?: HoverCardConfig;

  /** Default configuration for icon components. */
  icon?: IconConfig;

  /** Default configuration for input components. */
  input?: InputConfig;

  /** Default configuration for input OTP components. */
  inputOtp?: InputOtpConfig;

  /** Default configuration for keyboard key components. */
  keyboardKey?: KeyboardKeyConfig;

  /** Default configuration for label components. */
  label?: LabelConfig;

  /** Default configuration for layout components. */
  layout?: LayoutConfig;

  /** Default configuration for list components. */
  list?: ListConfig;

  /** Default configuration for menu components. */
  menu?: MenuConfig;

  /** Default configuration for number input components. */
  numberInput?: NumberInputConfig;

  /** Default configuration for pagination components. */
  pagination?: PaginationConfig;

  /** Default configuration for password components. */
  password?: PasswordConfig;

  /** Default configuration for popover components. */
  popover?: PopoverConfig;

  /** Default configuration for progress components. */
  progress?: ProgressConfig;

  /** Default configuration for radio components. */
  radio?: RadioConfig;

  /** Default configuration for scroll area components. */
  scrollArea?: ScrollAreaConfig;

  /** Default configuration for segment components. */
  segment?: SegmentConfig;

  /** Default configuration for select components. */
  select?: SelectConfig;

  /** Default configuration for slider components. */
  slider?: SliderConfig;

  /** Default configuration for sonner/toast components. */
  sonner?: SonnerConfig;

  /** Default configuration for switch components. */
  switch?: SwitchConfig;

  /** Default configuration for tabs components. */
  tabs?: TabsConfig;

  /** Default configuration for tag components. */
  tag?: TagConfig;

  /** Default configuration for textarea components. */
  textarea?: TextareaConfig;

  /** Default configuration for toggle components. */
  toggle?: ToggleConfig;

  /** Default configuration for tooltip components. */
  tooltip?: TooltipConfig;

  /** Default configuration for tree components. */
  tree?: TreeConfig;
}

/**
 * Configuration options for accordion components. Allows setting default props that apply to all accordion instances
 * globally.
 *
 * @example
 *   ```tsx
 *   accordion: {
 *   size: 'lg',
 *   orientation: 'vertical',
 *   collapsible: true,
 *   triggerIcon: <ChevronDown />,
 *   classNames: { trigger: 'custom-trigger' }
 *   }
 *   ```
 */
export type AccordionConfig = Pick<
  AccordionProps,
  | 'className'
  | 'classNames'
  | 'dir'
  | 'disabled'
  | 'orientation'
  | 'size'
  | 'triggerIcon'
  | 'triggerLeading'
  | 'triggerTrailing'
> & {
  /**
   * Whether accordion items can be collapsed after expansion (Single mode only).
   *
   * @default false
   */
  collapsible?: boolean;
};

/**
 * Configuration options for alert components. Selects specific props that can be set globally for all alerts.
 *
 * @example
 *   ```tsx
 *   alert: {
 *   variant: 'outline',
 *   size: 'md',
 *   color: 'success'
 *   }
 *   ```
 */
export type AlertConfig = Pick<
  AlertProps,
  'className' | 'classNames' | 'color' | 'icon' | 'leading' | 'size' | 'trailing' | 'variant'
>;

/**
 * Configuration options for alert dialog components. Selects specific props that can be set globally for all alert
 * dialogs.
 *
 * @example
 *   ```tsx
 *   alertDialog: {
 *   type: 'info',
 *   size: 'md',
 *   forceMountOverlay: true,
 *   classNames: { content: 'custom-content' }
 *   }
 *   ```
 */
export type AlertDialogConfig = Pick<
  AlertDialogProps,
  'className' | 'classNames' | 'forceMountOverlay' | 'forceMountPortal' | 'size' | 'type'
>;

/**
 * Configuration options for aspect ratio components. Selects specific props that can be set globally for all aspect
 * ratios.
 *
 * @example
 *   ```tsx
 *   aspectRatio: {
 *     className: 'custom-aspect-ratio';
 *   }
 *   ```
 */
export type AspectRatioConfig = Pick<AspectRatioProps, 'className'>;

/**
 * Configuration options for collapsible components. Selects specific props that can be set globally for all collapsible
 * instances.
 */
export type CollapsibleConfig = Pick<CollapsibleProps, 'className' | 'classNames' | 'disabled'>;

/**
 * Configuration options for command components. Selects specific props that can be set globally for all command
 * instances.
 */
export type CommandConfig = Pick<CommandProps, 'className' | 'classNames' | 'size'>;

/**
 * Configuration options for context menu components. Selects specific props that can be set globally for all context
 * menu instances.
 */
export type ContextMenuConfig = Pick<ContextMenuProps, 'className' | 'classNames' | 'dir' | 'size'>;

/**
 * Configuration options for dialog components. Selects specific props that can be set globally for all dialog
 * instances.
 */
export type DialogConfig = Pick<DialogProps, 'className' | 'classNames' | 'size'>;

/**
 * Configuration options for divider components. Selects specific props that can be set globally for all divider
 * instances.
 */
export type DividerConfig = Pick<DividerProps, 'className' | 'classNames' | 'orientation' | 'size'>;

/**
 * Configuration options for drawer components. Selects specific props that can be set globally for all drawer
 * instances.
 */
export type DrawerConfig = Pick<DrawerProps, 'classNames' | 'size'>;

/**
 * Configuration options for dropdown menu components. Selects specific props that can be set globally for all dropdown
 * menu instances.
 */
export type DropdownMenuConfig = Pick<DropdownMenuProps, 'className' | 'classNames' | 'dir' | 'size'>;

/**
 * Configuration options for form field components. Selects specific props that can be set globally for all form field
 * instances.
 */
export type FormFieldConfig = Pick<FormFieldProps, 'className' | 'classNames' | 'size'>;

/**
 * Configuration options for icon components. Selects specific props that can be set globally for all icons.
 *
 * @example
 *   ```tsx
 *   icon: {
 *   width: 24,
 *   height: 24,
 *   color: 'currentColor'
 *   }
 *   ```
 */
export type IconConfig = Pick<IconProps, 'className' | 'color' | 'height' | 'inline' | 'width'>;

/** Configuration options for input components. Selects specific props that can be set globally for all inputs. */
export type InputConfig = Pick<InputProps, 'className' | 'size'>;

/**
 * Configuration options for button components. Selects specific props that can be set globally for all buttons.
 *
 * @example
 *   ```tsx
 *   button: {
 *   variant: 'solid',
 *   color: 'primary',
 *   size: 'md',
 *   shape: 'rounded'
 *   }
 *   ```
 */
export type ButtonConfig = Pick<ButtonProps, 'className' | 'color' | 'shadow' | 'shape' | 'size' | 'variant'>;

/** Configuration options for badge components. Selects specific props that can be set globally for all badges. */
export type BadgeConfig = Pick<BadgeProps, 'className' | 'classNames' | 'color' | 'position' | 'size'>;

/** Configuration options for tag components. Selects specific props that can be set globally for all tags. */
export type TagConfig = Pick<TagProps, 'className' | 'color' | 'shape' | 'size' | 'variant'>;

/** Configuration options for radio components. Selects specific props that can be set globally for all radio groups. */
export type RadioConfig = Pick<RadioGroupProps, 'className' | 'classNames' | 'color' | 'size'>;

/** Configuration options for switch components. Selects specific props that can be set globally for all switches. */
export type SwitchConfig = Pick<SwitchProps, 'className' | 'classNames' | 'color' | 'size'>;

/** Configuration options for slider components. Selects specific props that can be set globally for all sliders. */
export type SliderConfig = Pick<SliderProps, 'className' | 'classNames' | 'color' | 'size'>;

/** Configuration options for progress components. Selects specific props that can be set globally for all progress bars. */
export type ProgressConfig = Pick<ProgressProps, 'className' | 'classNames' | 'color' | 'size'>;

/** Configuration options for avatar components. Selects specific props that can be set globally for all avatars. */
export type AvatarConfig = Pick<AvatarProps, 'className' | 'classNames' | 'size'>;

/** Configuration options for card components. Selects specific props that can be set globally for all cards. */
export type CardConfig = Pick<CardProps, 'className' | 'classNames' | 'size'>;

/** Configuration options for checkbox components. Selects specific props that can be set globally for all checkboxes. */
export type CheckboxConfig = Pick<CheckboxProps, 'className' | 'classNames' | 'color' | 'size'>;

/** Configuration options for textarea components. Selects specific props that can be set globally for all textareas. */
export type TextareaConfig = Pick<TextareaProps, 'className' | 'classNames' | 'size'>;

/** Configuration options for tooltip components. Selects specific props that can be set globally for all tooltips. */
export type TooltipConfig = Pick<TooltipProps, 'className' | 'classNames' | 'showArrow' | 'size'>;

/** Configuration options for tabs components. Selects specific props that can be set globally for all tabs. */
export type TabsConfig = Pick<TabsProps<TabsOptionData>, 'classNames' | 'enableIndicator' | 'orientation' | 'size'>;

/** Configuration options for toggle components. Selects specific props that can be set globally for all toggles. */
export type ToggleConfig = Pick<ToggleProps, 'className' | 'size' | 'variant'>;

/** Configuration options for popover components. Selects specific props that can be set globally for all popovers. */
export type PopoverConfig = Pick<PopoverProps, 'className' | 'classNames' | 'showArrow' | 'size'>;

/** Configuration options for select components. Selects specific props that can be set globally for all selects. */
export type SelectConfig = Pick<SelectProps, 'classNames' | 'size'>;

/** Configuration options for breadcrumb components. Selects specific props that can be set globally for all breadcrumbs. */
export type BreadcrumbConfig = Pick<BreadcrumbProps<BreadcrumbItem>, 'className' | 'classNames' | 'separator'>;

/** Configuration options for carousel components. Selects specific props that can be set globally for all carousels. */
export type CarouselConfig = Pick<CarouselProps, 'classNames' | 'orientation'>;

/** Configuration options for segment components. Selects specific props that can be set globally for all segments. */
export type SegmentConfig = Pick<
  SegmentProps<SegmentOptionData>,
  'classNames' | 'enableIndicator' | 'orientation' | 'size'
>;

/**
 * Configuration options for scroll area components. Selects specific props that can be set globally for all scroll
 * areas.
 */
export type ScrollAreaConfig = Pick<ScrollAreaProps, 'className' | 'classNames'>;

/** Configuration options for layout components. Selects specific props that can be set globally for all layouts. */
export type LayoutConfig = Pick<LayoutProps, 'collapsible' | 'side' | 'size' | 'variant'>;

/**
 * Configuration options for list components. Selects specific props that can be set globally for all lists.
 *
 * @example
 *   ```tsx
 *   list: {
 *   size: 'md',
 *   classNames: {
 *   root: 'custom-list',
 *   item: 'custom-item'
 *   }
 *   }
 *   ```
 */
export type ListConfig = Pick<ListProps, 'className' | 'classNames' | 'size'>;

/** Configuration options for label components. Selects specific props that can be set globally for all labels. */
export type LabelConfig = Pick<LabelProps, 'className' | 'size'>;

/**
 * Configuration options for keyboard key components. Selects specific props that can be set globally for all keyboard
 * keys.
 */
export type KeyboardKeyConfig = Pick<KeyboardKeyProps, 'className' | 'variant'>;

/** Configuration options for sheet components. Selects specific props that can be set globally for all sheets. */
export type BottomSheetConfig = Pick<BottomSheetProps, 'classNames' | 'size'>;

/** Configuration options for input OTP components. Selects specific props that can be set globally for all input OTPs. */
export type InputOtpConfig = Pick<InputOTPProps, 'className' | 'classNames' | 'size'>;

/** Configuration options for hover card components. Selects specific props that can be set globally for all hover cards. */
export type HoverCardConfig = Pick<HoverCardProps, 'className' | 'classNames' | 'showArrow'>;

/** Configuration options for menu components. Selects specific props that can be set globally for all menus. */
export type MenuConfig = Pick<MenuProps, 'classNames' | 'size'>;

/**
 * Configuration options for number input components. Selects specific props that can be set globally for all number
 * inputs.
 */
export type NumberInputConfig = Pick<NumberInputProps, 'center' | 'className' | 'classNames' | 'size'>;

/** Configuration options for pagination components. Selects specific props that can be set globally for all paginations. */
export type PaginationConfig = Pick<
  PaginationProps,
  'className' | 'classNames' | 'shape' | 'showEdges' | 'showFirstLast' | 'siblingCount' | 'size' | 'variant'
>;

/**
 * Configuration options for password components. Selects specific props that can be set globally for all password
 * inputs.
 */
export type PasswordConfig = Pick<
  PasswordProps,
  'className' | 'classNames' | 'clearable' | 'hiddenIcon' | 'size' | 'visibleIcon'
>;

/** Configuration options for sonner/toast components. Selects specific props that can be set globally for all toasters. */
export type SonnerConfig = Pick<ToasterProps, 'expand' | 'position' | 'richColors'>;

/** Configuration options for tree components. Selects specific props that can be set globally for all tree instances. */
export type TreeConfig = Pick<
  TreeProps,
  | 'allowParentSelect'
  | 'bubbleSelect'
  | 'className'
  | 'classNames'
  | 'dir'
  | 'disabled'
  | 'multiple'
  | 'propagateSelect'
  | 'selectionBehavior'
  | 'size'
  | 'toggleBehavior'
>;
