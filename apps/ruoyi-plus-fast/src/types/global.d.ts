// oxlint-disable unicorn/require-module-specifiers
import type { MessageInstance } from 'antd/es/message/interface';

export {};

declare global {
  /** Whether current runtime is development mode */
  export const __DEV__: boolean;

  /** Build time of the project */
  export const BUILD_TIME: string;

  interface Window {
    $message?: MessageInstance;
  }
}
