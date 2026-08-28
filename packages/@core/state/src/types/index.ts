/**
 * Storage interface for atom persistence.
 *
 * Adapter contract:
 *
 * - `getItem` returns the deserialized value (or `null` / `undefined` when missing). Adapters are responsible for parsing
 *   raw strings (e.g. `JSON.parse`) before returning.
 * - The interface is intentionally synchronous to mirror `localStorage` / `sessionStorage`. For asynchronous backends
 *   (React Native AsyncStorage, IndexedDB), prefer building on top of jotai's own async storage helpers.
 * - `subscribe` is optional. Implement it to push external changes (e.g. cross-tab `storage` events) back into atoms.
 */
export interface AtomStorage {
  /** Get item from storage; return `null` / `undefined` when the key is absent. */
  getItem: (key: string) => unknown;
  /** Remove item from storage. */
  removeItem: (key: string) => void;
  /** Set item in storage. */
  setItem: (key: string, value: unknown) => void;
  /**
   * Subscribe to external value changes for `key`.
   *
   * Should call `callback(value)` whenever the underlying storage value changes outside of `setItem` (typical use:
   * cross-tab `window.addEventListener('storage', ...)`).
   *
   * Must return an unsubscribe function.
   */
  subscribe?: (key: string, callback: (value: unknown) => void, initialValue: unknown) => () => void;
}
