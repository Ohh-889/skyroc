import type { AspectRatioProps as _AspectRatioProps } from '@radix-ui/react-aspect-ratio';
import type { StyledComponentProps } from '../../types/shared';

/**
 * Props for the aspect ratio component.
 * Wraps content in a container that maintains a fixed aspect ratio.
 *
 * @example
 * ```tsx
 * <AspectRatio ratio={16 / 9}>
 *   <img src="/image.jpg" alt="" />
 * </AspectRatio>
 * ```
 */
export interface AspectRatioProps extends StyledComponentProps<_AspectRatioProps> {}
