import { createStore } from 'jotai';
import type { Atom, PrimitiveAtom, WritableAtom } from 'jotai';
import type { SetStateAction } from 'jotai/vanilla';

/**
 * Global Jotai store.
 *
 * Use cases:
 *
 * 1. Access / modify atoms outside React (axios interceptors, event handlers, etc.)
 * 2. Test environments
 *
 * Inside React, read and write atoms with `useAtom` and let {@link JotaiProvider} supply this store — passing
 * `{ store: globalStore }` at every call site defeats the Provider and makes the subtree impossible to isolate.
 *
 * **Not suitable for SSR.** This is a module-level singleton, so a Node server shares one store across every request
 * and one user's state leaks into another's render. Server rendering needs a per-request `createStore()` passed to
 * jotai's own `<Provider>`.
 *
 * @see https://jotai.org/docs/core/store
 */
export const globalStore = createStore();

/** Read an atom value outside React. */
export function getAtomValue<Value>(atom: Atom<Value>): Value {
  return globalStore.get(atom);
}

/**
 * Write to an atom outside React.
 *
 * Generic over the atom's write arguments so it works with any `WritableAtom`, including ones whose write signature
 * differs from their read type (e.g. `atomWithPartial`, derived writers).
 *
 * Functional updates go through the same entry point — `setAtomValue(countAtom, prev => prev + 1)` — for any atom whose
 * write accepts a `SetStateAction`.
 */
export function setAtomValue<Value>(atom: PrimitiveAtom<Value>, value: SetStateAction<Value>): void;
export function setAtomValue<Value, Args extends unknown[], Result>(
  atom: WritableAtom<Value, Args, Result>,
  ...args: Args
): Result;
export function setAtomValue<Value, Args extends unknown[], Result>(
  atom: WritableAtom<Value, Args, Result>,
  ...args: Args
): Result {
  return globalStore.set(atom, ...args);
}
