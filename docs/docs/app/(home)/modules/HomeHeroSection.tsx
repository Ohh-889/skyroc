import { Button, Tag } from '@skyroc/web-ui';
import { ArrowRight, BookOpenText, Boxes, Braces, MonitorSmartphone, Route, Sparkles } from 'lucide-react';
import Link from 'next/link';

const HERO_ENTRIES = [
  {
    description: '环境准备、安装依赖并启动 Admin',
    href: '/docs/getting-started/quick-start',
    icon: Route,
    label: 'Quick start',
    title: '快速开始'
  },
  {
    description: '启动、路由、权限、请求与主题',
    href: '/docs/admin',
    icon: MonitorSmartphone,
    label: 'Application',
    title: 'Admin 应用'
  },
  {
    description: '基础能力、运行时与后台布局',
    href: '/docs/packages',
    icon: Boxes,
    label: 'Foundation',
    title: 'Core 与 Web Kit'
  }
];

const HERO_METRICS = [
  { label: '应用机制', value: '路由 · 权限' },
  { label: '业务基建', value: '请求 · 布局' },
  { label: '底层支撑', value: 'Core · Web Kit' }
];

export const HomeHeroSection = () => {
  return (
    <section className="relative isolate pt-28 md:pt-34">
      <div className="mx-auto w-[min(1180px,calc(100%-48px))] max-md:w-[min(620px,calc(100%-28px))]">
        <div className="relative grid gap-12 lg:grid-cols-[minmax(0,1.12fr)_minmax(370px,0.88fr)] lg:items-center lg:gap-16">
          <div className="pointer-events-none absolute top-1/2 right-[6%] -z-10 size-88 -translate-y-1/2 rounded-full bg-primary/7 blur-3xl" />

          <div className="flex flex-col justify-between lg:min-h-122 lg:py-7">
            <div>
              <Tag
                className="gap-2 border-primary/15 bg-card/25 text-primary shadow-none"
                color="primary"
                shape="rounded"
                variant="soft"
              >
                <BookOpenText
                  aria-hidden="true"
                  size={15}
                />
                <span>SKYROC ADMIN · DOCUMENTATION</span>
              </Tag>

              <h1 className="mt-6 max-w-180 font-sans text-[clamp(44px,5.1vw,68px)] leading-[1.04] font-extrabold tracking-[-0.055em] max-md:text-[clamp(36px,9.6vw,44px)]">
                Skyroc Admin
                <span className="block text-primary">开发与架构手册</span>
              </h1>

              <p className="mt-6 max-w-165 text-[16px] leading-7.5 text-muted-foreground max-md:text-[15px]">
                从项目启动、路由守卫、权限校验，到请求服务、后台布局与主题配置；同时讲清 Core、Shared 与 Web Kit
                如何支撑 Admin 应用。按开发链路查文档，也能沿着包边界定位源码。
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button
                  asChild
                  className="transition-transform hover:-translate-y-0.5"
                  color="primary"
                  shape="rounded"
                  shadow="lg"
                >
                  <Link href="/docs/getting-started/quick-start">
                    开始搭建 Admin{' '}
                    <ArrowRight
                      aria-hidden="true"
                      size={17}
                    />
                  </Link>
                </Button>
                <Button
                  asChild
                  className="bg-background/65 transition-transform hover:-translate-y-0.5"
                  color="primary"
                  shape="rounded"
                  variant="outline"
                >
                  <Link href="/docs/admin">查看 Admin 文档</Link>
                </Button>
              </div>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-5 border-t border-border/55 pt-6 max-sm:gap-3">
              {HERO_METRICS.map(item => (
                <div key={item.label}>
                  <strong className="block text-sm font-bold tracking-tight text-foreground md:text-base">
                    {item.value}
                  </strong>
                  <span className="mt-1 block text-[10px] font-bold tracking-[0.08em] text-muted-foreground uppercase">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <aside className="relative flex flex-col justify-center lg:min-h-122">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold tracking-[0.16em] text-primary uppercase">Start here</span>
                <h2 className="mt-1.5 text-xl font-bold tracking-[-0.03em]">从当前开发任务进入</h2>
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
                    className="group grid min-h-21 grid-cols-[42px_1fr_auto] items-center gap-3 bg-transparent px-4 py-3 text-inherit transition-colors duration-300 hover:bg-background/35"
                    href={item.href}
                    key={item.title}
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
                      className="text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-primary"
                      aria-hidden="true"
                      size={16}
                    />
                  </Link>
                );
              })}
            </div>

            <Link
              className="mt-4 flex items-center justify-between rounded-xl border border-dashed border-border/50 bg-card/15 px-4 py-3 text-xs font-semibold text-muted-foreground transition-colors hover:border-primary/35 hover:bg-card/35 hover:text-primary"
              href="/docs/architecture"
            >
              <span className="inline-flex items-center gap-2">
                <Braces
                  aria-hidden="true"
                  size={15}
                />
                查看 Monorepo 与包分层
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
  );
};
