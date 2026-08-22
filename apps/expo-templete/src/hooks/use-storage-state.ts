import * as SecureStore from 'expo-secure-store';
import { useCallback, useEffect, useState } from 'react';

type StorageState = {
  /** 是否仍在从 SecureStore 读取 */
  isLoading: boolean;
  setValue: (value: string | null) => void;
  /** 当前值；`null` 表示不存在 */
  value: string | null;
};

/** 写入 SecureStore，`null` 表示删除该项。 */
export async function setStorageItemAsync(key: string, value: string | null) {
  if (value === null) {
    await SecureStore.deleteItemAsync(key);
  } else {
    await SecureStore.setItemAsync(key, value);
  }
}

/** Persisted `useState`，底层用 SecureStore。 */
export function useStorageState(key: string): StorageState {
  const [isLoading, setIsLoading] = useState(true);

  const [value, setValue] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    setIsLoading(true);

    SecureStore.getItemAsync(key)
      .then(stored => {
        if (!cancelled) {
          setValue(stored);
        }
      })
      .catch(error => {
        // 读不出来按「没有值」处理，绝不能把 isLoading 卡在 true
        console.warn(`[useStorage] read "${key}" failed`, error);
        if (!cancelled) {
          setValue(null);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [key]);

  // 身份必须稳定：上层会把它包成 signIn / signOut 放进 context，
  // 每次渲染换一个新函数会让所有依赖它的 effect 白跑一遍
  const setValueState = useCallback(
    (next: string | null) => {
      setValue(next);

      setStorageItemAsync(key, next).catch(error => {
        console.warn(`[useStorage] write "${key}" failed`, error);
      });
    },
    [key],
  );

  return { isLoading, value, setValue: setValueState };
}
