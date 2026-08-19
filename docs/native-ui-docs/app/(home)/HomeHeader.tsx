'use client';

import { ArrowUpRight, GitBranch } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const NAVIGATION_LINK_CLASS_NAME =
  'inline-flex items-center gap-1 rounded-[9px] px-2.5 py-1.75 text-xs font-semibold text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground';

/** `external` 的走原生 <a> 而不是 <Link>：跨站不需要 Next.js 预取，也要带 target/rel， 并在文字后跟一个箭头图标，让「会离开本站」这件事在点击前就看得出来。 */
const NAVIGATION = [
  { external: false, href: '/docs/components/button', label: '组件' },
  { external: false, href: '/docs/overview/getting-started', label: '快速开始' },
  { external: true, href: 'https://web-ui-docs.skyroc.me/', label: 'Web Ui' },
  { external: true, href: 'https://admin.skyroc.me/', label: 'Admin 模板' }
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
        className={`pointer-events-auto relative mx-auto flex min-h-[60px] w-[min(1180px,100%)] items-center gap-[18px] px-6 py-3 transition-[min-height,padding,border-color,border-width,border-radius,background-color,backdrop-filter] duration-300 motion-reduce:transition-none max-[760px]:min-h-[52px] max-[760px]:px-[9px] max-[760px]:py-0 ${hasScrolled ? 'native-home-header-glass min-h-0 rounded-full border border-border/50 bg-background/20 max-[760px]:px-[9px] max-[760px]:py-2' : ''}`}
      >
        <Link
          className="inline-flex flex-none items-center gap-2 text-[17px] font-bold tracking-[-0.025em] text-foreground no-underline [font-family:'Avenir_Next','SF_Pro_Display','PingFang_SC',sans-serif]"
          href="/"
        >
          <span className="inline-flex size-[34px] items-center justify-center rounded-[10px]">
            <Image
              alt=""
              height={32}
              priority
              src="/favicon.svg"
              width={32}
            />
          </span>
          <span className="max-[760px]:hidden">Skyroc Native UI</span>
        </Link>

        <nav
          className="flex flex-1 items-center justify-center gap-0.5 max-[920px]:hidden"
          aria-label="主导航"
        >
          {NAVIGATION.map(item =>
            item.external ? (
              <a
                className={NAVIGATION_LINK_CLASS_NAME}
                href={item.href}
                key={item.href}
                rel="noreferrer"
                target="_blank"
              >
                {item.label}
                <ArrowUpRight
                  aria-hidden="true"
                  className="text-muted-foreground/70"
                  size={12}
                />
              </a>
            ) : (
              <Link
                className={NAVIGATION_LINK_CLASS_NAME}
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <a
            aria-label="打开 GitHub 仓库"
            className="inline-flex size-[34px] items-center justify-center rounded-[10px] text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
            href="https://github.com/Ohh-889/skyroc"
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
