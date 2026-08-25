/**
 * Re-exported so consumers write to storage-backed atoms without importing `jotai/utils` themselves.
 *
 * `RESET` is a module-level `unique symbol`: a second copy of jotai (pnpm forks it whenever peer
 * resolution differs) carries a *different* symbol, and `set(atom, RESET)` from the wrong copy fails
 * the identity check — the symbol gets persisted as a value instead of clearing the entry. Taking it
 * from here guarantees it comes from the same jotai instance the atoms were created with.
 */
export { RESET } from 'jotai/utils';
// Provider
export { JotaiProvider } from './provider/JotaiProvider';

export type { JotaiProviderProps } from './provider/JotaiProvider';

// Store
export { getAtomValue, globalStore, setAtomValue } from './store/global';

// Types
export type { AtomStorage } from './types';
// Utils
export { atomWithPartial } from './utils/atom-with-partial';
export type { PartialUpdater } from './utils/atom-with-partial';
export { createAtomWithStorage } from './utils/atom-with-storage';
export type { CreateAtomWithStorageOptions, StorageAtomUpdate } from './utils/atom-with-storage';

export { getStorage, hasStorage, registerStorage, unregisterStorage } from './utils/storage-registry';
