'use client';

import { useEffect, useState } from 'react';
import { HeaderActions } from './modules/HeaderActions';
import { HeaderBrand } from './modules/HeaderBrand';
import { HeaderNavigation } from './modules/HeaderNavigation';
import './modules/header.css';

interface HomeHeaderProps {
  /** 主文档入口地址 */
  docsUrl: string;
  /** GitHub 仓库地址 */
  githubUrl: string;
}

export const HomeHeader = (props: HomeHeaderProps) => {
  const { docsUrl, githubUrl } = props;
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
        className={`home-header-inner pointer-events-auto relative mx-auto flex min-h-[60px] w-[min(1180px,100%)] items-center gap-[18px] px-6 py-3 transition-[min-height,padding,border-color,border-width,border-radius,background-color,backdrop-filter] duration-300 motion-reduce:transition-none max-[760px]:min-h-[52px] max-[760px]:px-[9px] max-[760px]:py-0 ${hasScrolled ? 'header-glass min-h-0 rounded-full border border-border/50 bg-background/20 max-[760px]:px-[9px] max-[760px]:py-2' : ''}`}
      >
        <HeaderBrand docsUrl={docsUrl} />

        <HeaderNavigation />

        <HeaderActions
          docsUrl={docsUrl}
          githubUrl={githubUrl}
        />
      </div>
    </header>
  );
};
