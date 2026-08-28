'use client';

import { Icon } from '@skyroc/web-ui';
import { useGlassLayout } from 'fumadocs-ui/layouts/glass';
import { Header as GlassHeader } from 'fumadocs-ui/layouts/glass/slots/header';
import { MonitorPlay, SidebarIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { gitConfig } from '@/lib/shared';

/**
 * 中间导航与侧栏的 7 个 root 一一对应。
 *
 * Root 切换器是折叠的（可见 DOM 只渲染当前项），header 是唯一常驻可见的站内导航， 所以这里把 7 棵树全部平铺出来，读者不点开下拉也能看见文档站有哪几块。
 *
 * `match` 是这一项「拥有」的路径前缀，用来算高亮。现在是一一对应， 但保留数组形态：以后某棵树被合并或新增子树时，把前缀挂到对应项名下即可。
 *
 * 增减导航项时记得同步 `match`：所有 root 都要被某一项认领，且不能被两项同时认领。
 */
const DOCS_NAVIGATION = [
  { href: '/docs/guide', label: '指南', match: ['/docs/guide'] },
  { href: '/docs/admin', label: 'Admin', match: ['/docs/admin'] },
  { href: '/docs/core', label: '核心', match: ['/docs/core'] },
  { href: '/docs/hooks', label: 'Hooks', match: ['/docs/hooks'] },
  { href: '/docs/form', label: '表单', match: ['/docs/form'] },
  { href: '/docs/web', label: 'Web', match: ['/docs/web'] },
  { href: '/docs/packages', label: '包总览', match: ['/docs/packages'] }
] as const;

/** 前缀匹配，但要求正好落在路径分段边界上，避免 `/docs/form` 命中 `/docs/formatting` 这类同前缀路由 */
function matchesPrefix(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

/**
 * 取命中前缀最长的那一项。
 *
 * 简单的 `some(startsWith)` 在前缀互不重叠时也够用，但一旦有人把 `/docs/core` 提成独立项、 又忘了从「包文档」的 `match` 里删掉，就会两项同时高亮。取最长命中可以让更具体的那项赢。
 */
function getActiveHref(pathname: string) {
  let activeHref = '';
  let matchedLength = 0;

  for (const item of DOCS_NAVIGATION) {
    for (const prefix of item.match) {
      if (matchesPrefix(pathname, prefix) && prefix.length > matchedLength) {
        activeHref = item.href;
        matchedLength = prefix.length;
      }
    }
  }

  return activeHref;
}

/**
 * 站外预览入口，放在右侧 GitHub 图标旁边，刻意不进 `DOCS_NAVIGATION`：
 *
 * - 中间导航的高亮按 `/docs/*` 前缀算，外链永远不会命中，混进去会多一个永远灰着的异类
 * - 中间导航在 1200px 以下整条隐藏，而「先看看长什么样」恰恰是窄屏访客最需要的入口
 *
 * 第一项是主推的 demo，用 primary 底色；其余走描边样式，避免右侧出现两个同等份量的 CTA。
 *
 * RuoYi 那台是临时云服务器，走 HTTP 且直接暴露公网 IP：链接一旦进了公开文档就会被搜索引擎 和镜像站长期留存，换机器后也不会自动失效。已知并接受，换机器或下线时记得回来删这一条。
 */
const DOCS_PREVIEWS = [
  { href: 'https://admin.skyroc.me/', label: 'Admin 预览', primary: true },
  { href: 'http://47.98.185.172:8080/', label: 'RuoYi 预览', primary: false }
] as const;

interface DocsGlassHeaderProps {
  /** 允许 Glass 布局向自定义头部追加样式 */
  className?: string;
}

export const DocsGlassHeader = (props: DocsGlassHeaderProps) => {
  const { className = '' } = props;
  const pathname = usePathname();
  const { slots } = useGlassLayout();
  const activeHref = getActiveHref(pathname);
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
              aria-current={item.href === activeHref ? 'page' : undefined}
              href={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <GlassHeader className="skyroc-docs-header-actions" />

        <div className="skyroc-docs-header-previews">
          {DOCS_PREVIEWS.map(item => (
            <a
              key={item.href}
              /* 窄屏下文字会被 CSS 收掉只剩图标，图标是 aria-hidden，所以名字必须挂在链接上 */
              aria-label={item.label}
              className={`skyroc-docs-header-preview ${item.primary ? '' : 'is-muted'}`}
              href={item.href}
              rel="noreferrer"
              target="_blank"
              title={item.label}
            >
              <MonitorPlay aria-hidden="true" />
              <span>{item.label}</span>
            </a>
          ))}
        </div>

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
