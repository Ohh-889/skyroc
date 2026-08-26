import type {
  AvatarFallbackProps as _AvatarFallbackProps,
  AvatarImageProps as _AvatarImageProps,
  AvatarProps as _AvatarRootProps
} from '@radix-ui/react-avatar';
import type { ClassValue, StyledComponentProps } from '../../types/shared';
import type { AvatarSlots } from './avatar-variants';

/**
 * Class names for different slots in the avatar component.
 * Allows customizing styles for specific parts of the avatar.
 */
export type AvatarUi = Partial<Record<AvatarSlots, ClassValue>>;

/**
 * Props for the avatar root component.
 * Serves as the main container for the avatar element.
 */
export interface AvatarRootProps extends StyledComponentProps<_AvatarRootProps> {}

/**
 * Props for the avatar fallback component.
 * Displays alternative content when the avatar image fails to load.
 */
export interface AvatarFallbackProps extends StyledComponentProps<_AvatarFallbackProps> {}

/**
 * Props for the avatar image component.
 * Displays the avatar image from a specified source.
 */
export interface AvatarImageProps extends StyledComponentProps<_AvatarImageProps> {}

/**
 * Props for the main Avatar component.
 * Combines image and fallback content for displaying user avatars with graceful degradation.
 *
 * @example
 * ```jsx
 * <Avatar
 *   src="https://example.com/avatar.jpg"
 *   alt="John Doe"
 *   fallback="JD"
 *   delayMs={600}
 * />
 * ```
 */
export interface AvatarProps extends AvatarImageProps, Pick<AvatarFallbackProps, 'delayMs'> {
  /**
   * Class names for customizing different parts of the avatar.
   */
  classNames?: AvatarUi;
  /**
   * Fallback content displayed when the image fails to load or is still loading.
   * Typically shows initials or a placeholder icon.
   */
  fallback?: React.ReactNode;
  /**
   * Props for the avatar fallback component.
   */
  fallbackProps?: AvatarFallbackProps;
  /**
   * Props for the avatar root component.
   */
  rootProps?: AvatarRootProps;
}
