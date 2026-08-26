import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import type { StyledComponentProps } from '../../types/shared';

/**
 * Props for the Skeleton component.
 * A placeholder component that displays an animated loading skeleton while content is loading.
 * Inherits all standard HTML div attributes and custom component props.
 *
 * @example
 * ```tsx
 * // Simple skeleton placeholder
 * <Skeleton className="h-12 w-12 rounded-full" />
 *
 * // Skeleton lines
 * <div className="space-y-2">
 *   <Skeleton className="h-4 w-full" />
 *   <Skeleton className="h-4 w-3/4" />
 *   <Skeleton className="h-4 w-1/2" />
 * </div>
 *
 * // Skeleton for image placeholder
 * <Skeleton className="h-32 w-32 rounded-lg" />
 * ```
 */
export interface SkeletonProps extends StyledComponentProps<ComponentPropsWithoutRef<'div'>> {
  /**
   * Whether to show skeleton loading state
   * if true, the component will be skeletonized we will hide the content and show the skeleton loading state
   * @default false
   */
  loading?: boolean;
}

/**
 * Animation type for skeleton
 */
export type SkeletonAnimation = 'none' | 'pulse' | 'wave';

/**
 * Props for the SkeletonContainer component.
 * A container component that automatically converts children to skeleton placeholders when loading.
 * Preserves the structure and layout of children while showing loading state.
 *
 * @example
 * ```tsx
 * // Basic usage - wrap any content
 * <SkeletonContainer loading={isLoading}>
 *   <div className="flex gap-4">
 *     <img src={avatar} className="w-12 h-12 rounded-full" />
 *     <div>
 *       <h3>User Name</h3>
 *       <p>Description text here</p>
 *     </div>
 *   </div>
 * </SkeletonContainer>
 *
 * // With custom animation
 * <SkeletonContainer loading={isLoading} animation="wave">
 *   <Card>
 *     <CardTitle>Title</CardTitle>
 *     <CardContent>Content</CardContent>
 *   </Card>
 * </SkeletonContainer>
 *
 * // Exclude specific elements from skeletonization using key
 * <SkeletonContainer loading={isLoading} excludeKeys={['action-btn']}>
 *   <div>
 *     <p>This will be skeletonized</p>
 *     <button key="action-btn">This button stays visible</button>
 *   </div>
 * </SkeletonContainer>
 * ```
 */
export interface SkeletonContainerProps extends SkeletonProps {
  /**
   * Animation type for the skeleton
   * @default 'pulse'
   */
  animation?: SkeletonAnimation;

  /**
   * The content to display or skeletonize
   */
  children: ReactNode;

  /**
   * Depth level for recursive skeletonization
   * Set to 0 to only skeletonize direct text content
   * @default Infinity
   */
  depth?: number;

  /**
   * Keys of elements to exclude from skeletonization.
   * Elements with matching keys will remain visible during loading.
   * Set a key prop on the element you want to exclude.
   * @default []
   *
   * @example
   * ```tsx
   * <SkeletonContainer loading excludeKeys={['submit-btn', 'icon']}>
   *   <p>This text will be skeletonized</p>
   *   <button key="submit-btn">This stays visible</button>
   *   <Icon key="icon" />
   * </SkeletonContainer>
   * ```
   */
  excludeKeys?: string[];

  /**
   * Whether to show skeleton loading state
   * @default false
   */
  loading?: boolean;

  /**
   * Custom skeleton color
   */
  skeletonColor?: string;

  /**
   * Custom border radius for skeleton blocks
   */
  skeletonRadius?: string;
}
