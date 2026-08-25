import type BScroll from '@better-scroll/core';
import { useEffect, useRef, useState } from 'react';

export function useTabScroll(activeTabId: string) {
  const bsWrapper = useRef<HTMLDivElement>(null);
  const tabRef = useRef<HTMLDivElement>(null);
  const bsScrollRef = useRef<BScroll | null>(null);
  const [bsWrapperInfo, setBsWrapperInfo] = useState({ width: 0, left: 0 });

  // Update wrapper info when window resizes
  useEffect(() => {
    const updateWrapperInfo = () => {
      if (bsWrapper.current) {
        const rect = bsWrapper.current.getBoundingClientRect();
        setBsWrapperInfo({ width: rect.width, left: rect.left });
      }
    };

    updateWrapperInfo();
    window.addEventListener('resize', updateWrapperInfo);

    return () => {
      window.removeEventListener('resize', updateWrapperInfo);
    };
  }, []);

  /** Scroll to active tab */
  async function scrollToActiveTab() {
    await new Promise(resolve => {
      setTimeout(resolve, 0);
    });

    if (!tabRef.current) return;

    const { children } = tabRef.current;

    for (let i = 0; i < children.length; i += 1) {
      const child = children[i];

      const tabId = child.id;

      if (tabId === activeTabId) {
        const { left, width } = child.getBoundingClientRect();
        const clientX = left + width / 2;

        setTimeout(() => {
          scrollByClientX(clientX);
        }, 50);

        break;
      }
    }
  }

  /**
   * Scroll by client X
   *
   * @param clientX
   */
  function scrollByClientX(clientX: number) {
    const currentX = clientX - bsWrapperInfo.left;
    const deltaX = currentX - bsWrapperInfo.width / 2;

    if (bsScrollRef.current) {
      const { maxScrollX, scrollBy, x: leftX } = bsScrollRef.current;

      const rightX = maxScrollX - leftX;
      const update = deltaX > 0 ? Math.max(-deltaX, rightX) : Math.min(-deltaX, -leftX);

      scrollBy(update, 0, 300);
    }
  }

  // Watch active tab id and scroll to it
  useEffect(() => {
    scrollToActiveTab();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTabId]);

  return {
    bsWrapper,
    tabRef,
    bsScrollRef,
    scrollToActiveTab
  };
}
