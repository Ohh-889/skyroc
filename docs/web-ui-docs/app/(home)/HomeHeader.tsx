'use client';

import { BookOpenText, GitBranch, PanelTop } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const NAVIGATION = [
  { href: '/components/button', label: '组件' },
  { href: '/overview/introduction', label: '概览' },
  { href: '/overview/design-system', label: '设计系统' },
  { href: '/overview/examples', label: '场景示例' }
] as const;

export const HomeHeader = () => {
  const [hasScrolled, setHasScrolled] = useState(false);

  function handleScroll() {
    setHasScrolled(window.scrollY > 18);
  }

  useEffect(() => {
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`pointer-events-none fixed inset-x-0 top-0 z-50 px-6 transition-[top] duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none max-[760px]:px-2.5 ${hasScrolled ? 'top-3 max-[760px]:top-2' : ''}`}
    >
      <div
        className={`pointer-events-auto relative mx-auto flex min-h-16 w-[min(1180px,100%)] items-center gap-8 px-4 transition-[min-height,padding,border-color,border-width,border-radius,background-color,backdrop-filter,box-shadow] duration-300 motion-reduce:transition-none max-md:gap-3 max-[760px]:min-h-13 max-[760px]:px-2.5 ${hasScrolled ? 'ui-home-header-glass min-h-14 rounded-full border border-border/50 bg-background/38 shadow-[0_20px_60px_-34px_hsl(var(--foreground)/0.65)] max-[760px]:min-h-12' : ''}`}
      >
        <Link
          className="flex shrink-0 items-center gap-2.5 text-foreground"
          href="/"
        >
          <Image
            alt=""
            className="size-8.5"
            height={34}
            priority
            src="/favicon.svg"
            width={34}
          />
          <span className="text-[15px] font-extrabold tracking-[-0.035em]">Skyroc UI</span>
          <span className="rounded-md border border-primary/15 bg-primary/8 px-1.5 py-0.5 text-[8px] font-extrabold tracking-[0.13em] text-primary uppercase">
            Docs
          </span>
        </Link>

        <nav
          className="flex flex-1 items-center justify-center gap-1 max-md:hidden"
          aria-label="主导航"
        >
          {NAVIGATION.map(item => (
            <Link
              className="rounded-lg px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:bg-primary/7 hover:text-foreground"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Link
            className="inline-flex h-9 items-center gap-2 rounded-xl border border-primary/20 bg-primary/8 px-3 text-xs font-semibold text-primary transition-colors hover:bg-primary/14 max-sm:px-2.5"
            href="/components/button"
          >
            <BookOpenText
              aria-hidden="true"
              size={15}
            />
            <span className="max-sm:hidden">浏览组件</span>
          </Link>
          <a
            aria-label="打开 Admin 文档"
            className="inline-flex size-9 items-center justify-center rounded-xl border border-border/65 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            href="https://admin-docs.skyroc.me/docs/web/ui"
          >
            <PanelTop
              aria-hidden="true"
              size={16}
            />
          </a>
          <a
            aria-label="打开 GitHub 仓库"
            className="inline-flex size-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            href="https://github.com/soybeanjs/soybean-admin-react"
            rel="noreferrer"
            target="_blank"
          >
            <GitBranch
              aria-hidden="true"
              size={17}
            />
          </a>
        </div>
      </div>
    </header>
  );
};
