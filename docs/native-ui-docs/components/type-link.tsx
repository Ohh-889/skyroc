'use client';

import type { MouseEvent } from 'react';
import { useEffect, useState } from 'react';

interface TypeLinkProps {
  /** 当前页锚点 id（type-xxx） */
  anchorId: string;
  /** 类型名 */
  name: string;
  /** 注册表里的跨页地址；未注册或目标页面还不存在时为空 */
  registryHref?: string;
}

const LINK_CLASS =
  'cursor-pointer border-b-2 border-dashed border-fd-primary/30 text-fd-primary no-underline duration-200 hover:border-fd-primary';

/** 注册表地址正好指向当前页时，取它的 hash，用来退化成页内滚动 */
function resolveSamePageAnchorId(registryHref?: string) {
  if (!registryHref) return undefined;

  const [pathname, hash] = registryHref.split('#');

  if (!hash || pathname !== window.location.pathname) return undefined;

  return hash;
}

/**
 * 类型链接。
 *
 * 优先级：当前页存在同名锚点 → 页内平滑滚动；否则 → 注册表的跨页地址；
 * 两者都没有 → 退化成纯文本，不给一个点了会 404 或没反应的链接。
 *
 * 「当前页有没有这个锚点」只能挂载后查 DOM，所以 SSR 先按页内锚点渲染
 * （绝大多数类型都定义在本页），挂载后发现锚点不存在再降级。
 */
export const TypeLink = (props: TypeLinkProps) => {
  const { anchorId, name, registryHref } = props;

  const [localAnchorId, setLocalAnchorId] = useState<string | undefined>(anchorId);

  useEffect(() => {
    if (document.getElementById(anchorId)) {
      setLocalAnchorId(anchorId);
      return;
    }

    const samePageAnchorId = resolveSamePageAnchorId(registryHref);

    setLocalAnchorId(samePageAnchorId && document.getElementById(samePageAnchorId) ? samePageAnchorId : undefined);
  }, [anchorId, registryHref]);

  const href = localAnchorId ? `#${localAnchorId}` : registryHref;

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (!localAnchorId) return;

    const target = document.getElementById(localAnchorId);

    if (!target) return;

    // 页内跳转自己滚，避免默认的瞬间跳变；scroll-mt-* 会被 scroll-margin 吃掉
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.history.replaceState(null, '', `#${localAnchorId}`);
  }

  if (!href) {
    return <span>{name}</span>;
  }

  return (
    <a
      className={LINK_CLASS}
      href={href}
      onClick={handleClick}
    >
      {name}
    </a>
  );
};
