import { vi } from 'vitest';

interface MatchMediaRecord {
  /** 当前查询订阅的 change listeners。 */
  listeners: Set<(event: MediaQueryListEvent) => void>;
  /** 当前查询是否匹配。 */
  matches: boolean;
}

export interface MatchMediaController {
  /** 读取指定 query 的 listener 数量。 */
  listenerCount: (query: string) => number;
  /** 更新指定 query 的匹配状态并通知订阅者。 */
  setMatches: (query: string, matches: boolean) => void;
}

export function installMatchMedia(defaultMatches: boolean): MatchMediaController {
  const records = new Map<string, MatchMediaRecord>();

  function getRecord(query: string) {
    const existing = records.get(query);

    if (existing) {
      return existing;
    }

    const record = {
      matches: defaultMatches,
      listeners: new Set<(event: MediaQueryListEvent) => void>()
    };

    records.set(query, record);

    return record;
  }

  const matchMedia = vi.fn((query: string): MediaQueryList => {
    const record = getRecord(query);

    return {
      addEventListener: (_type: string, listener: EventListenerOrEventListenerObject) => {
        record.listeners.add(listener as (event: MediaQueryListEvent) => void);
      },
      addListener: listener => {
        record.listeners.add(listener as (event: MediaQueryListEvent) => void);
      },
      dispatchEvent: () => true,
      matches: record.matches,
      media: query,
      onchange: null,
      removeEventListener: (_type: string, listener: EventListenerOrEventListenerObject) => {
        record.listeners.delete(listener as (event: MediaQueryListEvent) => void);
      },
      removeListener: listener => {
        record.listeners.delete(listener as (event: MediaQueryListEvent) => void);
      }
    };
  });

  vi.stubGlobal('matchMedia', matchMedia);

  return {
    listenerCount: query => getRecord(query).listeners.size,
    setMatches: (query, matches) => {
      const record = getRecord(query);
      const event = { matches, media: query } as MediaQueryListEvent;

      record.matches = matches;
      record.listeners.forEach(listener => listener(event));
    }
  };
}
