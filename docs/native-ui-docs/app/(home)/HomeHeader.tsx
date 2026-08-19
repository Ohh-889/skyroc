'use client';

import { BookOpenText, GitBranch, Smartphone } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const NAVIGATION = [
  { href: '/docs/components/button', label: '组件' },
  { href: '/#reading-paths', label: '开始使用' },
  { href: '/#capabilities', label: '原生能力' },
  { href: '/#component-map', label: '组件地图' }
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
          {NAVIGATION.map(item => (
            <Link
              className="rounded-[9px] px-2.5 py-1.75 text-xs font-semibold text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <Link
            className="inline-flex h-[34px] items-center gap-1.5 rounded-[10px] border border-primary/28 bg-primary/10 px-3 text-xs font-semibold text-primary transition-colors hover:border-primary/45 hover:bg-primary/18 max-[520px]:w-[34px] max-[520px]:justify-center max-[520px]:px-0"
            href="/docs/components/button"
          >
            <BookOpenText
              aria-hidden="true"
              size={15}
            />
            <span className="max-[520px]:hidden">浏览组件</span>
          </Link>
          <a
            aria-label="打开 Native Playground"
            className="inline-flex size-[34px] items-center justify-center rounded-[10px] border border-border/65 text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground max-[420px]:hidden"
            href="https://github.com/Ohh-889/skyroc/tree/main/apps/native-ui-playground"
            rel="noreferrer"
            target="_blank"
          >
            <Smartphone
              aria-hidden="true"
              size={16}
            />
          </a>
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
