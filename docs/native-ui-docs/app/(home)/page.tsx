import {
  ArrowRight,
  BookOpenText,
  Braces,
  Boxes,
  Code2,
  Component,
  MonitorSmartphone,
  Route,
  Sparkles
} from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { COMPONENT_CATEGORIES, PLATFORM_FEATURES } from './home-data';
import { HomeHeader } from './HomeHeader';

const HERO_ENTRIES = [
  {
    description: '从 Button 开始查看 Demo、用法与完整类型',
    href: '/docs/components/button',
    icon: Component,
    label: 'Components',
    title: '浏览组件'
  },
  {
    description: '按输入、导航、弹层与反馈任务定位能力',
    href: '/#component-map',
    icon: Route,
    label: 'Component map',
    title: '按任务查找'
  },
  {
    description: '沿 Expo 示例理解组件在真实页面中的行为',
    href: 'https://github.com/Ohh-889/skyroc/tree/master/apps/native-ui-playground',
    icon: MonitorSmartphone,
    label: 'Playground',
    title: '查看运行示例'
  }
] as const;

const READING_PATHS = [
  {
    description: '安装组件库、接入 Uniwind，并从第一个 Button 开始确认开发链路。',
    eyebrow: '01 · 初次接入',
    href: '/docs/components/button',
    icon: BookOpenText,
    title: '接入第一个 Native 组件'
  },
  {
    description: '按输入、布局、导航、弹层与反馈的界面任务找到对应组件。',
    eyebrow: '02 · 开发界面',
    href: '/#component-map',
    icon: Boxes,
    title: '沿移动端任务选择组件'
  },
  {
    description: '从文档 Demo 继续追到 Playground 页面、组件源码和 TypeScript 类型。',
    eyebrow: '03 · 深入源码',
    href: 'https://github.com/Ohh-889/skyroc/tree/master/packages/native/ui/src',
    icon: Code2,
    title: '追到实现与公共契约'
  }
] as const;

export const metadata: Metadata = {
  description: 'Skyroc Native UI 的组件、交互示例与 React Native 使用指南。',
  title: 'Skyroc Native UI'
};

const HomePage = () => {
  return (
    <div className="native-home-grid relative min-h-screen overflow-hidden bg-background text-foreground">
      <HomeHeader />

      <main>
        <section className="relative isolate pt-28 md:pt-34">
          <div className="mx-auto w-[min(1180px,calc(100%-48px))] max-md:w-[min(620px,calc(100%-28px))]">
            <div className="relative grid gap-12 lg:grid-cols-[minmax(0,1.12fr)_minmax(370px,0.88fr)] lg:items-center lg:gap-16">
              <div className="pointer-events-none absolute top-1/2 right-[6%] -z-10 size-88 -translate-y-1/2 rounded-full bg-primary/7 blur-3xl" />

              <div className="flex flex-col justify-between lg:min-h-122 lg:py-7">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-card/25 px-3 py-1.5 text-[10px] font-extrabold tracking-[0.12em] text-primary uppercase">
                    <BookOpenText
                      aria-hidden="true"
                      size={15}
                    />
                    SKYROC NATIVE UI · DOCUMENTATION
                  </span>

                  <h1 className="mt-6 max-w-180 font-sans text-[clamp(44px,5.1vw,68px)] leading-[1.04] font-extrabold tracking-[-0.055em] max-md:text-[clamp(36px,9.6vw,44px)]">
                    Skyroc Native UI
                    <span className="block text-primary">React Native 组件手册</span>
                  </h1>

                  <p className="mt-6 max-w-165 text-[16px] leading-7.5 text-muted-foreground max-md:text-[15px]">
                    从基础操作、表单输入、数据展示，到移动导航、原生弹层与状态反馈；每篇文档连接真实 Playground
                    Demo、公共类型和组件实现，帮助你从选型直接走到可运行界面。
                  </p>

                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <Link
                      className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-lg transition-transform hover:-translate-y-0.5"
                      href="/docs/components/button"
                    >
                      浏览全部组件
                      <ArrowRight
                        aria-hidden="true"
                        size={17}
                      />
                    </Link>
                    <a
                      className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-primary bg-background/65 px-4 text-sm font-semibold text-primary transition-transform hover:-translate-y-0.5"
                      href="https://github.com/Ohh-889/skyroc/tree/master/apps/native-ui-playground"
                      rel="noreferrer"
                      target="_blank"
                    >
                      打开 Playground
                    </a>
                  </div>
                </div>

                <div className="mt-10 grid grid-cols-3 gap-5 border-t border-border/55 pt-6 max-sm:gap-3">
                  <div>
                    <strong className="block text-sm font-bold tracking-tight md:text-base">50 篇</strong>
                    <span className="mt-1 block text-[10px] font-bold tracking-[0.08em] text-muted-foreground uppercase">
                      组件文档
                    </span>
                  </div>
                  <div>
                    <strong className="block text-sm font-bold tracking-tight md:text-base">7 类</strong>
                    <span className="mt-1 block text-[10px] font-bold tracking-[0.08em] text-muted-foreground uppercase">
                      界面任务
                    </span>
                  </div>
                  <div>
                    <strong className="block text-sm font-bold tracking-tight md:text-base">iOS · Android</strong>
                    <span className="mt-1 block text-[10px] font-bold tracking-[0.08em] text-muted-foreground uppercase">
                      跨端交付
                    </span>
                  </div>
                </div>
              </div>

              <aside className="relative flex flex-col justify-center lg:min-h-122">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold tracking-[0.16em] text-primary uppercase">
                      Start here
                    </span>
                    <h2 className="mt-1.5 text-xl font-bold tracking-[-0.03em]">从当前界面任务进入</h2>
                  </div>
                  <span className="flex size-9 items-center justify-center rounded-full border border-primary/15 bg-card/25 text-primary">
                    <Sparkles
                      aria-hidden="true"
                      size={17}
                    />
                  </span>
                </div>

                <div className="divide-y divide-border/50 overflow-hidden rounded-2xl border border-border/50 bg-card/25 shadow-sm">
                  {HERO_ENTRIES.map((item, index) => {
                    const Icon = item.icon;

                    return (
                      <Link
                        className="group grid min-h-21 grid-cols-[42px_1fr_auto] items-center gap-3 px-4 py-3 text-inherit transition-colors duration-300 hover:bg-background/35"
                        href={item.href}
                        key={item.title}
                        target={item.href.startsWith('http') ? '_blank' : undefined}
                      >
                        <span className="flex size-10 items-center justify-center rounded-xl bg-primary/9 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                          <Icon
                            aria-hidden="true"
                            size={19}
                          />
                        </span>
                        <span>
                          <span className="flex items-center gap-2">
                            <strong className="text-sm">{item.title}</strong>
                            <small className="font-mono text-[9px] tracking-wide text-muted-foreground uppercase">
                              0{index + 1} · {item.label}
                            </small>
                          </span>
                          <span className="mt-1 block text-xs text-muted-foreground">{item.description}</span>
                        </span>
                        <ArrowRight
                          aria-hidden="true"
                          className="text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-primary"
                          size={16}
                        />
                      </Link>
                    );
                  })}
                </div>

                <Link
                  className="mt-4 flex items-center justify-between rounded-xl border border-dashed border-border/50 bg-card/15 px-4 py-3 text-xs font-semibold text-muted-foreground transition-colors hover:border-primary/35 hover:bg-card/35 hover:text-primary"
                  href="/#capabilities"
                >
                  <span className="inline-flex items-center gap-2">
                    <Braces
                      aria-hidden="true"
                      size={15}
                    />
                    查看 Native 组件设计边界
                  </span>
                  <ArrowRight
                    aria-hidden="true"
                    size={15}
                  />
                </Link>
              </aside>
            </div>
          </div>
        </section>

        <section
          className="mx-auto w-[min(1180px,calc(100%-48px))] pt-22 md:pt-30 max-md:w-[min(620px,calc(100%-28px))]"
          id="reading-paths"
        >
          <div className="mb-9 flex items-end justify-between gap-12 max-md:block">
            <div>
              <span className="mb-3 block text-[10px] font-extrabold tracking-[0.16em] text-primary uppercase">
                Native reading paths
              </span>
              <h2 className="text-[clamp(30px,3vw,42px)] leading-tight font-bold tracking-[-0.04em]">
                按移动端开发链路阅读
              </h2>
            </div>
            <p className="text-sm leading-7 text-muted-foreground lg:whitespace-nowrap max-md:mt-4">
              从当前任务进入，再追到 Demo、类型与源码。
            </p>
          </div>

          <div className="grid divide-y divide-border/50 overflow-hidden rounded-2xl border border-border/50 bg-card/25 shadow-sm md:grid-cols-3 md:divide-x md:divide-y-0">
            {READING_PATHS.map(item => {
              const Icon = item.icon;

              return (
                <Link
                  className="group relative min-h-62 overflow-hidden p-6 text-inherit transition-colors duration-300 hover:bg-background/35"
                  href={item.href}
                  key={item.title}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                >
                  <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon
                      aria-hidden="true"
                      size={20}
                    />
                  </span>
                  <span className="mt-6 mb-2 block font-mono text-[9px] font-bold tracking-[0.1em] text-muted-foreground uppercase">
                    {item.eyebrow}
                  </span>
                  <h3 className="text-lg font-semibold tracking-tight">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-primary">
                    进入阅读{' '}
                    <ArrowRight
                      aria-hidden="true"
                      className="transition-transform group-hover:translate-x-1"
                      size={15}
                    />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        <section
          className="relative isolate pt-20 md:pt-24"
          id="capabilities"
        >
          <div className="mx-auto w-[min(1180px,calc(100%-48px))] max-md:w-[min(620px,calc(100%-28px))]">
            <div className="mb-9 flex items-end justify-between gap-12 max-md:block">
              <div>
                <span className="mb-3 block text-[10px] font-extrabold tracking-[0.16em] text-primary uppercase">
                  Native by default
                </span>
                <h2 className="text-[clamp(30px,3vw,42px)] leading-tight font-bold tracking-[-0.04em]">
                  不把 Web 组件缩进手机里
                </h2>
              </div>
              <p className="text-sm leading-7 text-muted-foreground max-md:mt-4">
                移动端行为本身就是公共组件契约的一部分。
              </p>
            </div>

            <div className="grid gap-x-10 border-t border-border/60 md:grid-cols-2 lg:grid-cols-3">
              {PLATFORM_FEATURES.map(item => {
                const Icon = item.icon;

                return (
                  <article
                    className="group flex min-h-40 gap-4 border-b border-border/60 py-6"
                    key={item.title}
                  >
                    <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:-translate-y-0.5">
                      <Icon
                        aria-hidden="true"
                        size={21}
                      />
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold tracking-tight">{item.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section
          className="mx-auto w-[min(1180px,calc(100%-48px))] pt-20 md:pt-24 max-md:w-[min(620px,calc(100%-28px))]"
          id="component-map"
        >
          <div className="mb-9 flex items-end justify-between gap-12 max-md:block">
            <div>
              <span className="mb-3 block text-[10px] font-extrabold tracking-[0.16em] text-primary uppercase">
                Component map
              </span>
              <h2 className="text-[clamp(30px,3vw,42px)] leading-tight font-bold tracking-[-0.04em]">
                按界面任务找到正确组件
              </h2>
            </div>
            <Link
              className="mb-1 inline-flex items-center gap-2 text-xs font-bold text-primary max-md:mt-4"
              href="/docs/components/button"
            >
              查看组件文档{' '}
              <ArrowRight
                aria-hidden="true"
                size={16}
              />
            </Link>
          </div>

          <div className="grid overflow-hidden rounded-2xl border border-border/50 bg-card/25 shadow-sm md:grid-cols-2">
            {COMPONENT_CATEGORIES.map(item => {
              const Icon = item.icon;

              return (
                <Link
                  className="group relative min-h-46 border-b border-border/50 p-6 text-inherit transition-colors hover:bg-background/35 odd:md:border-r"
                  href={item.href}
                  key={item.title}
                >
                  <div className="flex items-center justify-between">
                    <span className={`flex size-10 items-center justify-center rounded-xl ${item.accentClassName}`}>
                      <Icon
                        aria-hidden="true"
                        size={20}
                      />
                    </span>
                    <span className="text-[10px] font-extrabold tracking-[0.12em] text-muted-foreground uppercase">
                      {item.items.length} examples
                    </span>
                  </div>
                  <h3 className="mt-5 text-lg font-semibold tracking-tight">{item.title}</h3>
                  <p className="mt-2 max-w-[84%] text-sm leading-6 text-muted-foreground">{item.description}</p>
                  <ArrowRight
                    aria-hidden="true"
                    className="absolute right-5 bottom-5 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-primary"
                    size={17}
                  />
                </Link>
              );
            })}
          </div>
        </section>
      </main>

      <footer className="mx-auto grid min-h-28 w-[min(1180px,calc(100%-48px))] grid-cols-[1fr_auto_1fr] items-center text-[11px] text-muted-foreground max-md:w-[min(620px,calc(100%-28px))] max-md:grid-cols-[1fr_auto]">
        <div className="flex items-center gap-2 text-foreground">
          <Image
            alt=""
            height={26}
            src="/favicon.svg"
            width={26}
          />
          <strong className="text-[13px] font-bold tracking-[-0.025em] [font-family:'Avenir_Next','SF_Pro_Display','PingFang_SC',sans-serif]">
            Skyroc Native UI
          </strong>
        </div>
        <p className="max-md:hidden">Built for real React Native interfaces.</p>
        <span className="text-right">© 2026 Skyroc</span>
      </footer>
    </div>
  );
};

export default HomePage;
