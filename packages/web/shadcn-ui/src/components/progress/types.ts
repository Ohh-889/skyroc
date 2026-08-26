import type { ProgressProps as _ProgressProps } from '@radix-ui/react-progress';
import type { ClassValue, StyledComponentProps, ThemeColor } from '../../types/shared';
import type { ProgressSlots } from './progress-variants';

/**
 * Class names for different slots in the progress component.
 * Allows customizing styles for specific parts of the progress bar.
 */
export type ProgressClassNames = Partial<Record<ProgressSlots, ClassValue>>;

/**
 * Props for the Progress component.
 * A visual indicator showing the progress of an operation or task.
 *
 * @example
 * // Basic progress bar at 60%
 * <Progress value={60} max={100} />
 *
 * @example
 * // Progress bar with custom color
 * <Progress
 *   value={75}
 *   max={100}
 *   color="success"
 *   classNames={{
 *     root: 'h-2',
 *     indicator: 'bg-green-500'
 *   }}
 * />
 *
 * @example
 * // Indeterminate progress (loading)
 * <Progress className="animate-pulse" />
 *
 * @example
 * // Progress with label
 * <div className="space-y-2">
 *   <div className="flex justify-between text-sm">
 *     <span>Loading...</span>
 *     <span>45%</span>
 *   </div>
 *   <Progress value={45} max={100} />
 * </div>
 */
export interface ProgressProps extends StyledComponentProps<Omit<_ProgressProps, 'children'>> {
  /** Class names for customizing different parts of the progress component */
  classNames?: ProgressClassNames;
  /** Color variant for the progress bar */
  color?: ThemeColor;
}
