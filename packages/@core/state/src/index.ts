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
