import Image from 'next/image';
import Link from 'next/link';
import { FOOTER_LINKS } from './home-data';
import { HomeHeader } from './HomeHeader';
import { ComponentMapSection } from './modules/ComponentMapSection';
import { DocumentationPathsSection } from './modules/DocumentationPathsSection';
import { HomeHeroSection } from './modules/HomeHeroSection';
import { ShowcaseSection } from './modules/ShowcaseSection';

const HomePage = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground [background-image:linear-gradient(hsl(var(--border)/0.28)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--border)/0.28)_1px,transparent_1px)] [background-size:28px_28px]">
      <HomeHeader />

      <main>
        <HomeHeroSection />
        <ComponentMapSection />
        <ShowcaseSection />
        <DocumentationPathsSection />
      </main>

      <footer className="border-t border-border/45 bg-background/70">
        <div className="mx-auto flex min-h-28 w-[min(1180px,calc(100%-48px))] items-center justify-between gap-6 max-md:w-[min(620px,calc(100%-28px))] max-sm:flex-col max-sm:items-start max-sm:justify-center">
          <div className="flex items-center gap-2 text-foreground">
            <Image
              alt=""
              className="size-8"
              height={32}
              src="/favicon.svg"
              width={32}
            />
            <div>
              <strong className="block text-[13px] font-extrabold tracking-[-0.025em]">Skyroc UI</strong>
              <span className="mt-0.5 block text-[10px] text-muted-foreground">Built for real product interfaces.</span>
            </div>
          </div>

          <nav
            className="flex items-center gap-5 text-xs font-semibold text-muted-foreground"
            aria-label="页脚导航"
          >
            {FOOTER_LINKS.map(item => (
              <Link
                className="transition-colors hover:text-primary"
                href={item.href}
                key={item.label}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <span className="text-[10px] text-muted-foreground">© 2026 Skyroc</span>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
