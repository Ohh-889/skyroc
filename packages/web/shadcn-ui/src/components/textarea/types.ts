import type { ReactNode } from 'react';
import type { ClassValue, HTMLComponentProps } from '../../types/shared';
import type { TextareaSlots } from './textarea-variants';

/**
 * Props for the textarea content element. Represents the actual textarea HTML element.
 *
 * @example
 *   ```tsx
 *   const props: TextareaContentProps = {
 *     placeholder: 'Enter text...',
 *     maxLength: 500,
 *     value: 'Some text'
 *   };
 *   ```
 */
export interface TextareaContentProps extends HTMLComponentProps<'textarea'> {}

/**
 * Class names for different slots in the textarea component. Allows customizing styles for specific parts (root,
 * content, count, etc.).
 *
 * @example
 *   ```tsx
 *   const classNames: TextareaClassNames = {
 *     root: 'custom-root',
 *     content: 'custom-textarea',
 *     count: 'custom-count'
 *   };
 *   ```
 */
export type TextareaClassNames = Partial<Record<TextareaSlots, ClassValue>>;

/**
 * Props for the character count display component. Manages the character or grapheme counting functionality.
 *
 * @example
 *   ```tsx
 *   const countProps: TextareaCountProps = {
 *     value: 'text',
 *     maxLength: 100,
 *     children: count => `${count}/100`,
 *     countGraphemes: input => input.length
 *   };
 *   ```
 */
export interface TextareaCountProps
  extends Omit<HTMLComponentProps<'div'>, 'children'>, Pick<TextareaContentProps, 'maxLength' | 'value'> {
  /** Render function to display the character count. Receives the formatted count string as a parameter. */
  children?: (count: string) => ReactNode;
  /**
   * Custom function to count characters. Useful for counting graphemes instead of Unicode code units. Receives the
   * textarea value and returns the count.
   *
   * @param input - The textarea input value
   * @returns The count of characters/graphemes
   */
  countGraphemes?: (input: TextareaContentProps['value']) => number;
}

/** Props for the textarea root/wrapper component. The container element that wraps the textarea and count display. */
export interface TextareaRootProps extends HTMLComponentProps<'div'> {}

/**
 * Props for the Textarea component. Combines textarea content, counting functionality, and styling options.
 *
 * @example
 *   ```tsx
 *   <Textarea
 *     placeholder="Enter your message..."
 *     maxLength={500}
 *     showCount={true}
 *     countRender={count => `${count}/500`}
 *     onTextChange={value => console.log(value)}
 *     classNames={{ count: 'text-gray-500' }}
 *   />;
 *   ```
 */
export interface TextareaProps extends TextareaContentProps, Pick<TextareaCountProps, 'countGraphemes'> {
  /** Class names for customizing different slots of the textarea component. */
  classNames?: TextareaClassNames;
  /**
   * Render function to display the character count. Called with the formatted count string. Only displayed when
   * `showCount` is true.
   */
  countRender?: (count: string) => ReactNode;
  /** Callback fired whenever the textarea value changes. Receives the new value as a parameter. */
  onTextChange?: (value: TextareaContentProps['value']) => void;
  /** Whether to display the character count. When true, the count display is rendered below or near the textarea. */
  showCount?: boolean;
}
