import type { ReactNode } from 'react';
import type { HTMLComponentProps } from '../../types/shared';
import type { KbdSize, KbdVariant } from './kbd-variants';

/**
 * Predefined keyboard keys that have built-in styling and special handling.
 * These keys are commonly used in keyboard shortcuts and key combination displays.
 */
export type KbdKey
  = | 'alt'
    | 'arrowdown'
    | 'arrowleft'
    | 'arrowright'
    | 'arrowup'
    | 'backspace'
    | 'capslock'
    | 'command'
    | 'ctrl'
    | 'delete'
    | 'end'
    | 'enter'
    | 'escape'
    | 'home'
    | 'meta'
    | 'option'
    | 'pagedown'
    | 'pageup'
    | 'shift'
    | 'tab'
    | 'win';

/**
 * Union type that accepts either built-in keyboard keys or custom key strings.
 */
export type KbdValue = KbdKey | (string & {});

/**
 * Props for the KeyboardKey component.
 * Renders a visual representation of one or more keyboard keys.
 *
 * @example
 * // Single key
 * <KeyboardKey value="enter" />
 *
 * @example
 * // Key combination (multiple keys)
 * <KeyboardKey value={['ctrl', 'c']} />
 *
 * @example
 * // Custom rendering
 * <KeyboardKey value="cmd">Custom content</KeyboardKey>
 */
export interface KeyboardKeyProps extends Omit<HTMLComponentProps<'kbd'>, 'children'> {
  /**
   * Custom content to display. If not provided, will display the formatted value.
   */
  children?: ReactNode;
  /**
   * Size of the keyboard key(s).
   */
  size?: KbdSize;
  /**
   * Whether to convert the command value to symbol representation.
   * @defaultValue true
   */
  symbolize?: boolean;
  /**
   * The keyboard key(s) to display.
   * Can be a single key or an array of keys.
   */
  value?: KbdValue | KbdValue[];
  /**
   * Visual variant style for the keyboard key(s).
   */
  variant?: KbdVariant;
}

/**
 * Props for the KeyboardKeyGroup component.
 * Renders multiple keyboard keys with a separator between them.
 *
 * @example
 * // Keyboard shortcut with default separator
 * <KeyboardKeyGroup values={['ctrl', 'shift', 'k']} />
 *
 * @example
 * // Custom separator
 * <KeyboardKeyGroup
 *   values={['cmd', 'option', 'j']}
 *   separator=" + "
 * />
 */
export interface KeyboardKeyGroupProps extends Omit<KeyboardKeyProps, 'value'> {
  /**
   * Content to display between keyboard keys (separator).
   * Defaults to a visual separator if not provided.
   */
  separator?: ReactNode;
  /**
   * Array of keyboard key values to display in the group.
   */
  values: KbdValue[];
}

export type { KbdSize, KbdVariant };
