import { createStorage } from '@skyroc/utils';

const DEFAULT_STORAGE_PREFIX = 'SR_';

export const storagePrefix = import.meta.env.VITE_STORAGE_PREFIX || DEFAULT_STORAGE_PREFIX;

export const localStg = createStorage<StorageType.Local>('local', storagePrefix);
