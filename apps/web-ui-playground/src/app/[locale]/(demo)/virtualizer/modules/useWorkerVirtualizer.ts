'use client';

import { useEffect, useRef, useState } from 'react';

export function useGenerateSentences(count: number) {
  const workerRef = useRef<Worker>(null);

  const [sentences, setSentences] = useState<string[] | null>(null);

  useEffect(() => {
    const worker = new Worker(new URL('./generateSentences.worker.ts', import.meta.url), { type: 'module' });

    workerRef.current = worker;

    function handleMessage(event: MessageEvent<{ sentences: string[] }>) {
      setSentences(event.data.sentences);
    }

    worker.addEventListener('message', handleMessage);

    // oxlint-disable-next-line unicorn/require-post-message-target-origin
    worker.postMessage({ count });

    return () => {
      worker.removeEventListener('message', handleMessage);
      worker.terminate();
    };
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return sentences; // null = loading
}
