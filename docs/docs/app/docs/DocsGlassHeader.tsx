'use client';

import { Icon } from '@skyroc/web-ui';
import { useGlassLayout } from 'fumadocs-ui/layouts/glass';
import { Header as GlassHeader } from 'fumadocs-ui/layouts/glass/slots/header';
import { SidebarIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { gitConfig } from '@/lib/shared';

/**
 * 中间导航按「读者意图」分三组，而不是镜像侧栏的 7 个 root。
 *
 * 7 个 root 在侧栏切换器里是折叠的（只渲染当前项），header 是唯一常驻可见的站内导航，
 * 但塞不下 7 项。这三项各自是一类读者意图的入口，`/docs/packages` 落地页开头的分流表
 * 负责把人送到 core / hooks / form / web 四棵包树。
 */
const DOCS_NAVIGATION = [
  { href: '/docs/guide', label: '指南' },
  { href: '/docs/admin', label: 'Admin' },
  { href: '/docs/packages', label: '包文档' }
] as const;

interface DocsGlassHeaderProps {
  /** 允许 Glass 布局向自定义头部追加样式 */
  className?: string;
}

export const DocsGlassHeader = (props: DocsGlassHeaderProps) => {
  const { className = '' } = props;
  const { slots } = useGlassLayout();
  const sidebar = slots.sidebar.use();
  const showSidebarToggle = sidebar.collapsible && sidebar.collapsed;

  function handleShowSidebar() {
    sidebar.setCollapsed(false);
  }

  return (
    <header className={`skyroc-docs-header ${className}`}>
      <div className="skyroc-docs-header-inner">
        <div className="skyroc-docs-header-leading">
          <Link
            className="skyroc-docs-header-brand"
            href="/"
          >
            <Image
              alt=""
              height={28}
              priority
              src="/favicon.svg"
              width={28}
            />
            <span className="max-sm:hidden">SkyrocAdmin</span>
            <span className="skyroc-docs-header-badge">Docs</span>
          </Link>

          {showSidebarToggle ? (
            <button
              aria-label="展开侧栏"
              className="skyroc-docs-sidebar-toggle"
              type="button"
              onClick={handleShowSidebar}
            >
              <SidebarIcon aria-hidden="true" />
            </button>
          ) : null}
        </div>

        <nav
          aria-label="文档站点导航"
          className="skyroc-docs-header-nav"
        >
          {DOCS_NAVIGATION.map(item => (
            <Link
              key={item.href}
              href={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <GlassHeader className="skyroc-docs-header-actions" />

        <a
          aria-label="GitHub"
          className="skyroc-docs-header-github"
          href={`https://github.com/${gitConfig.user}/${gitConfig.repo}`}
          rel="noreferrer"
          target="_blank"
        >
          <Icon
            aria-hidden="true"
            icon="lucide:github"
          />
        </a>
      </div>
    </header>
  );
};
