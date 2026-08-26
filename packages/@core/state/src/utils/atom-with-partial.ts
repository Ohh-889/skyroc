import { atom } from 'jotai';
import type { WritableAtom } from 'jotai';

export type PartialUpdater<T extends object> = Partial<T> | ((prev: T) => Partial<T>);

/**
 * Create an atom that supports partial updates.
 *
 * Encapsulates the common "merge partial state into existing state" pattern. Skips updates whose every key matches the
 * current value (per `Object.is`) so subscribers don't re-render on no-op writes.
 *
 * Accepts either an object patch or an updater function.
 *
 * @example
 *   ```ts
 *   const adminStateAtom = atomWithPartial({ siderCollapse: false, mixSiderFixed: false });
 *
 *   // In component
 *   const [state, setState] = useAtom(adminStateAtom);
 *   setState({ siderCollapse: true });               // patch form
 *   setState(prev => ({ siderCollapse: !prev.siderCollapse })); // updater form
 *   ```
 */
export function atomWithPartial<T extends object>(
  initialValue: T
): WritableAtom<T, [PartialUpdater<T>], void> {
  const baseAtom = atom(initialValue);
  baseAtom.debugPrivate = true;

  return atom(
    get => get(baseAtom),
    (get, set, update: PartialUpdater<T>) => {
      const prev = get(baseAtom);
      const patch = typeof update === 'function' ? update(prev) : update;

      let changed = false;
      for (const key in patch) {
        if (Object.hasOwn(patch, key) && !Object.is(prev[key], patch[key] as T[typeof key])) {
          changed = true;
          break;
        }
      }

      if (changed) {
        set(baseAtom, { ...prev, ...patch });
      }
    }
  );
}
