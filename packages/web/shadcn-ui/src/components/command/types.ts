import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import type {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  CommandRoot,
  CommandSeparator
} from 'cmdk';
import type { ClassValue, HTMLComponentProps, SlotProps, StyledComponentProps, ThemeSize } from '../../types/shared';
import type { DialogClassNames, DialogProps } from '../dialog';
import type { CommandSlots } from './command-variants';

/**
 * Class names for different slots in the command component.
 * Allows customizing styles for specific parts of the command palette.
 */
export type CommandClassNames = Partial<Record<CommandSlots, ClassValue>>;

/**
 * Props for the command empty state component.
 * Displayed when no items match the search input.
 */
export type CommandEmptyProps = StyledComponentProps<ComponentPropsWithoutRef<typeof CommandEmpty>>;

/**
 * Props for the command group component.
 * Groups related command items together with a label.
 */
export type CommandGroupProps = StyledComponentProps<ComponentPropsWithoutRef<(typeof Command)['Group']>> & {
  /**
   * Custom class names for group-related slots.
   */
  classNames?: Pick<CommandClassNames, 'group' | 'groupLabel'>;
};

/**
 * Props for the command input component.
 * The search input field at the top of the command palette.
 */
export type CommandInputProps = StyledComponentProps<Omit<ComponentPropsWithoutRef<typeof CommandInput>, 'size'>> & {
  /**
   * Custom class names for input-related slots.
   */
  classNames?: Pick<CommandClassNames, 'input' | 'inputIcon' | 'inputWrapper'>;
} & SlotProps;

/**
 * Props for individual command item component.
 * Represents a single selectable command in the list.
 */
export type CommandItemProps = StyledComponentProps<ComponentPropsWithoutRef<typeof CommandItem>> & {
  /**
   * Keyboard shortcut associated with this command.
   * Can be a single string or array of modifier combinations.
   * @example 'Cmd+K' or ['Ctrl+N', 'Alt+N']
   */
  shortcut?: string | string[];
} & SlotProps;

/**
 * Props for the command list component.
 * Container for all command items and groups.
 */
export type CommandListProps = StyledComponentProps<ComponentPropsWithoutRef<typeof CommandList>>;

/**
 * Props for the command root/container component.
 * The main wrapper component for the command palette.
 */
export type CommandRootProps = StyledComponentProps<ComponentPropsWithoutRef<typeof CommandRoot>>;

/**
 * Props for the command separator component.
 * Visual divider between command groups or sections.
 */
export type CommandSeparatorProps = StyledComponentProps<ComponentPropsWithoutRef<typeof CommandSeparator>>;

/**
 * Props for displaying keyboard shortcuts.
 * Shows the shortcut key combination for a command item.
 */
export type CommandShortcutProps = HTMLComponentProps<'div'> & {
  /**
   * The shortcut key combination to display.
   * Can be a single string or array of combinations.
   */
  value?: string | string[];
};

/**
 * Data structure for a command group option.
 * Groups multiple command items together with a label.
 *
 * @example
 * ```tsx
 * {
 *   type: 'group',
 *   label: 'Navigation',
 *   children: [
 *     { type: 'item', label: 'Home' },
 *     { type: 'item', label: 'About' }
 *   ]
 * }
 * ```
 */
export type CommandGroupOptionProps = Omit<CommandGroupProps, 'children' | 'heading'> & {
  /**
   * Array of command items or separators in this group.
   */
  children: CommandOptionData[];

  /**
   * Label displayed for the group.
   */
  label?: ReactNode;

  /**
   * Identifies this option as a group.
   */
  type?: 'group';
};

/**
 * Data structure for a command separator option.
 * Creates a visual divider in the command list.
 */
export type CommandSeparatorOptionProps = CommandSeparatorProps & {
  /**
   * Identifies this option as a separator.
   */
  type: 'separator';
};

/**
 * Data structure for a command item option.
 * Represents a single selectable command in the palette.
 *
 * @example
 * ```tsx
 * {
 *   type: 'item',
 *   label: 'Create New File',
 *   shortcut: 'Cmd+N',
 *   onSelect: () => console.log('File created')
 * }
 * ```
 */
export type CommandItemOptionProps = Omit<CommandItemProps, 'children'> & {
  /**
   * Label displayed for the command item.
   */
  label?: ReactNode;

  /**
   * Identifies this option as an item.
   */
  type?: 'item';
};

/**
 * Union type for command option data.
 * Can be a group, separator, or individual item.
 */
export type CommandOptionData = CommandGroupOptionProps | CommandSeparatorOptionProps | CommandItemOptionProps;

/**
 * Props for the command option renderer component.
 * Used when rendering individual command options.
 */
export interface CommandOptionProps {
  /**
   * Custom class names for command slots.
   */
  classNames?: CommandClassNames;

  /**
   * The command option data to render.
   */
  item: CommandOptionData;

  /**
   * Size variant for the command option.
   */
  size?: ThemeSize;
}

/**
 * Props for the main Command component.
 * A searchable command palette/menu with data-driven rendering.
 *
 * @example
 * ```tsx
 * <Command
 *   items={[
 *     { type: 'group', label: 'File', children: [...] },
 *     { type: 'item', label: 'Exit' }
 *   ]}
 *   inputProps={{ placeholder: 'Search...' }}
 * />
 * ```
 */
export interface CommandProps extends CommandRootProps {
  /**
   * Custom class names for different command slots.
   */
  classNames?: CommandClassNames;

  /**
   * Content to display when no items match the search.
   */
  empty?: ReactNode;

  /**
   * Props to pass to the input component.
   */
  inputProps?: CommandInputProps;

  /**
   * Array of command options (items, groups, or separators).
   */
  items: CommandOptionData[];
}

/**
 * Props for the Command Dialog component.
 * A dialog-wrapped command palette for modal interaction.
 *
 * @example
 * ```tsx
 * <CommandDialog open={open} onOpenChange={setOpen}>
 *   <Command items={items} />
 * </CommandDialog>
 * ```
 */
export interface CommandDialogProps
  extends Omit<DialogProps, 'classNames' | 'footer' | 'trigger'> {
  /**
   * Custom class names for dialog-related slots.
   * Limited to overlay, content, and close button styling.
   */
  classNames?: Pick<DialogClassNames, 'close' | 'content' | 'description' | 'header' | 'overlay' | 'title'>;
}
