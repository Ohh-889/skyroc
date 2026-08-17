import Image from 'next/image';
import { HomeHeader } from './HomeHeader';
import { CapabilitiesSection } from './modules/CapabilitiesSection';
import { DocumentationMapSection } from './modules/DocumentationMapSection';
import { HomeHeroSection } from './modules/HomeHeroSection';
import { ReadingPathsSection } from './modules/ReadingPathsSection';

interface HomePageProps {
  /** Next.js 首页保留参数，便于未来接入动态内容 */
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

const HomePage = (_props: HomePageProps) => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground [background-image:linear-gradient(hsl(var(--border)/0.32)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--border)/0.32)_1px,transparent_1px)] [background-size:28px_28px]">
      <HomeHeader
        docsUrl="/docs"
        githubUrl="https://github.com/Ohh-889/skyroc"
      />

      <main>
        <HomeHeroSection />
        <ReadingPathsSection />
        <CapabilitiesSection />
        <DocumentationMapSection />
      </main>

      <footer className="mx-auto grid min-h-28 w-[min(1180px,calc(100%-48px))] grid-cols-[1fr_auto_1fr] items-center text-[11px] text-muted-foreground max-md:w-[min(620px,calc(100%-28px))] max-md:grid-cols-[1fr_auto]">
        <div className="flex items-center gap-2 text-foreground">
          <span className="inline-flex size-7 items-center justify-center rounded-[10px]">
            <Image
              alt=""
              height={26}
              src="/favicon.svg"
              width={26}
            />
          </span>
          <strong className="text-[13px] font-bold tracking-[-0.025em] [font-family:'Avenir_Next','SF_Pro_Display','PingFang_SC',sans-serif]">
            SkyrocAdmin
          </strong>
        </div>
        <p className="max-md:hidden">Built for maintainable React systems.</p>
        <span className="text-right">© 2026 Skyroc</span>
      </footer>
    </div>
  );
};

export default HomePage;
