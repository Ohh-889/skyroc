import type { ReactNode } from 'react';
import type { InputProps } from '../input';

/**
 * Props for the Password component.
 * A styled password input element with visibility toggle and optional clear button.
 *
 * @example
 * ```tsx
 * // Basic password input
 * <Password placeholder="Enter password" />
 *
 * // Controlled password with visibility
 * <Password
 *   value={password}
 *   onChange={e => setPassword(e.target.value)}
 *   visible={visible}
 *   onVisibleChange={setVisible}
 * />
 *
 * // Password with clearable button
 * <Password clearable placeholder="Enter password" />
 *
 * // Password with custom visibility icons
 * <Password
 *   visibleIcon={<LockOpen />}
 *   hiddenIcon={<Lock />}
 * />
 *
 * // Disabled password
 * <Password disabled placeholder="Disabled" />
 * ```
 */
export interface PasswordProps extends InputProps {

  /**
   * Default visibility state when uncontrolled.
   * @default false
   */
  defaultVisible?: boolean;
  /**
   * Custom icon to show when password is hidden.
   * @default <EyeOff />
   */
  hiddenIcon?: ReactNode;
  /**
   * Callback when visibility state changes.
   */
  onVisibleChange?: (visible: boolean) => void;
  /**
   * Controlled visibility state of the password.
   */
  visible?: boolean;
  /**
   * Custom icon to show when password is visible.
   * @default <Eye />
   */
  visibleIcon?: ReactNode;
}
