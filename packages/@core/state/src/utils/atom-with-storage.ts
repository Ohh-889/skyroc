import { atom } from 'jotai';
import type { WritableAtom } from 'jotai';
import { atomWithStorage as jotaiAtomWithStorage } from 'jotai/utils';
import type { RESET } from 'jotai/utils';

import type { AtomStorage } from '../types';
import { getStorage } from './storage-registry';

/** Label used in diagnostics when the adapter is passed directly instead of resolved by name. */
const DIRECT_STORAGE_LABEL = '<direct>';

/** `storageName:key` pairs already bound to an atom, used to surface accidental key collisions. */
const boundKeys = new Set<string>();

/** Diagnostics already emitted, so a broken storage doesn't flood the console on every read. */
const warnedIds = new Set<string>();

function warnOnce(id: string, message: string) {
  if (warnedIds.has(id)) return;

  warnedIds.add(id);
  // oxlint-disable-next-line no-console
  console.warn(`[core-state] ${message}`);
}

/** Write argument accepted by a storage-backed atom — a value, an updater, or `RESET` to drop the persisted entry. */
export type StorageAtomUpdate<T> = T | typeof RESET | ((prev: T) => T | typeof RESET);

export interface CreateAtomWithStorageOptions<T> {
  /**
   * Whether to read storage synchronously on first access, before the atom is mounted.
   *
   * Set to `false` if SSR hydration mismatch is a concern — the value is then read on mount only.
   *
   * @default true
   */
  getOnInit?: boolean;
  /** Direct storage adapter — bypasses the registry when provided. */
  storage?: AtomStorage;
  /**
   * Registry name to resolve storage from.
   *
   * Ignored when `storage` is provided.
   *
   * @default 'local'
   */
  storageName?: string;
  /**
   * Guard against persisted data that no longer matches `T`.
   *
   * Receives the raw value returned by the adapter and returns the accepted value, or `undefined` to reject it and fall
   * back to `initialValue`. Without it the raw value is trusted and cast to `T`.
   */
  validate?: (raw: unknown) => T | undefined;
}

/**
 * Create a persistent atom backed by a registered (or directly provided) storage adapter.
 *
 * Storage is resolved on **first access**, not at creation time. Atoms are normally module-level constants, and ESM
 * evaluates them before the app entry runs — resolving eagerly would mean every persisted atom throws on import. The
 * practical contract is therefore: call `registerStorage` before the first read/write of the atom, which the app entry
 * naturally satisfies.
 *
 * Serialization is the adapter's responsibility — the wrapper assumes `storage.getItem` already returns the
 * deserialized value (or `null` / `undefined` when the key is absent). This avoids the foot-gun of feeding an
 * already-parsed object back through `JSON.parse`. Use `validate` when persisted data may predate the current shape.
 *
 * Storage failures never propagate: a failing read falls back to `initialValue`, and a failing write (quota exceeded,
 * Safari private mode) still updates the atom, it just isn't persisted. Each distinct failure is logged once.
 *
 * @example
 *   ```ts
 *   // Uses registered 'local' storage (default)
 *   const themeAtom = createAtomWithStorage('theme', { mode: 'light' });
 *
 *   // Uses registered 'session' storage
 *   const tabAtom = createAtomWithStorage('tab', 'home', { storageName: 'session' });
 *
 *   // Bypass registry with a direct storage adapter
 *   const customAtom = createAtomWithStorage('key', val, { storage: myAdapter });
 *
 *   // Reject persisted data that no longer matches the current shape
 *   const userAtom = createAtomWithStorage('user', defaultUser, {
 *     validate: raw => (isUser(raw) ? raw : undefined)
 *   });
 *   ```;
 */
export function createAtomWithStorage<T>(
  key: string,
  initialValue: T,
  options?: CreateAtomWithStorageOptions<T>
): WritableAtom<T, [StorageAtomUpdate<T>], void> {
  const storageName = options?.storageName ?? 'local';
  const getOnInit = options?.getOnInit ?? true;
  const validate = options?.validate;

  const label = options?.storage ? DIRECT_STORAGE_LABEL : storageName;
  const bindingId = `${label}:${key}`;

  if (boundKeys.has(bindingId)) {
    warnOnce(
      `duplicate:${bindingId}`,
      `Storage key "${key}" (storage: ${label}) is already bound to another atom. The two atoms will overwrite each other.`
    );
  }
  boundKeys.add(bindingId);

  function resolveStorage(): AtomStorage {
    return options?.storage ?? getStorage(storageName);
  }

  function normalize(raw: unknown, fallback: T): T {
    if (raw === null || raw === undefined) return fallback;

    if (!validate) return raw as T;

    const validated = validate(raw);

    if (validated === undefined) {
      warnOnce(`invalid:${bindingId}`, `Persisted value for "${key}" (storage: ${label}) was rejected by validate().`);
      return fallback;
    }

    return validated;
  }

  const adapter = {
    getItem: (keyToGet: string, fallback: T): T => {
      try {
        return normalize(resolveStorage().getItem(keyToGet), fallback);
      } catch (error) {
        warnOnce(
          `read:${bindingId}`,
          `Reading "${key}" from storage "${label}" failed, falling back to the initial value. ${String(error)}`
        );
        return fallback;
      }
    },
    removeItem: (keyToRemove: string): void => {
      try {
        resolveStorage().removeItem(keyToRemove);
      } catch (error) {
        warnOnce(`remove:${bindingId}`, `Removing "${key}" from storage "${label}" failed. ${String(error)}`);
      }
    },
    setItem: (keyToSet: string, value: T): void => {
      try {
        resolveStorage().setItem(keyToSet, value);
      } catch (error) {
        warnOnce(
          `write:${bindingId}`,
          `Writing "${key}" to storage "${label}" failed — the atom is updated but the value is not persisted. ${String(error)}`
        );
      }
    },
    subscribe: (keyToSubscribe: string, callback: (value: T) => void, fallback: T): (() => void) => {
      let storageImpl: AtomStorage;

      try {
        storageImpl = resolveStorage();
      } catch {
        return () => {};
      }

      if (!storageImpl.subscribe) return () => {};

      return storageImpl.subscribe(keyToSubscribe, next => callback(normalize(next, fallback)), fallback);
    }
  };

  // Created on first access so that `getOnInit` reads storage after the app has registered its adapters.
  let inner: WritableAtom<T, [StorageAtomUpdate<T>], void> | undefined;

  function getInner() {
    inner ??= jotaiAtomWithStorage<T>(key, initialValue, adapter, { getOnInit });

    return inner;
  }

  return atom(
    get => get(getInner()),
    (_get, set, update: StorageAtomUpdate<T>) => {
      set(getInner(), update);
    }
  );
}
