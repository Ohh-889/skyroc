'use client';

import { Icon } from '@skyroc/web-ui';
import { useGlassLayout } from 'fumadocs-ui/layouts/glass';
import { Header as GlassHeader } from 'fumadocs-ui/layouts/glass/slots/header';
import { SidebarIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { gitConfig } from '@/lib/shared';

const DOCS_NAVIGATION = [
  { href: '/docs', label: '文档首页' },
  { href: '/docs/admin', label: 'Admin' },
  { href: '/docs/packages', label: 'Packages' },
  { href: '/docs/architecture', label: '架构设计' }
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
