import { Button, Progress, Tag } from '@skyroc/web-ui';
import { ArrowRight, Braces, Check, Component, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { HERO_ENTRIES, HOME_METRICS } from '../home-data';
import { InstallCommand } from '../InstallCommand';

const HeroComponentPreview = () => {
  return (
    <div className="relative overflow-hidden rounded-[22px] border border-border/55 bg-card/30 p-5 shadow-[0_28px_80px_-56px_hsl(var(--foreground)/0.55)] backdrop-blur">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <span className="text-[9px] font-extrabold tracking-[0.14em] text-primary uppercase">Live surface</span>
          <h3 className="mt-1 text-base font-bold tracking-[-0.025em]">真实组件，直接上手</h3>
        </div>
        <span className="flex size-9 items-center justify-center rounded-full border border-primary/15 bg-primary/8 text-primary">
          <Sparkles
            aria-hidden="true"
            size={17}
          />
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        <div className="rounded-2xl border border-border/55 bg-background/72 p-4">
          <span className="text-[11px] font-semibold text-muted-foreground">Actions</span>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              color="primary"
              shape="rounded"
              size="sm"
            >
              保存更改
            </Button>
            <Button
              color="secondary"
              shape="rounded"
              size="sm"
              variant="outline"
            >
              预览
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border border-border/55 bg-background/72 p-4">
          <span className="text-[11px] font-semibold text-muted-foreground">Status</span>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <Tag color="success">稳定</Tag>
            <Tag color="primary">React 19</Tag>
            <Tag color="info">Typed</Tag>
          </div>
        </div>

        <div className="rounded-2xl border border-border/55 bg-background/72 p-4 sm:col-span-2 lg:col-span-1 xl:col-span-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-foreground">组件覆盖</span>
            <span className="font-mono text-success">54 / 54</span>
          </div>
          <Progress
            aria-label="组件覆盖率"
            className="mt-3"
            color="primary"
            value={100}
          />
          <div className="mt-3 flex items-center gap-2 text-[11px] text-muted-foreground">
            <Check
              aria-hidden="true"
              className="text-success"
              size={14}
            />
            文档、Demo 与 API 在同一条开发链路中维护
          </div>
        </div>
      </div>
    </div>
  );
};

export const HomeHeroSection = () => {
  return (
    <section className="relative isolate pt-22 md:pt-28">
      <div className="pointer-events-none absolute top-2 right-[14%] -z-10 size-96 rounded-full bg-primary/7 blur-3xl" />

      <div className="mx-auto w-[min(1180px,calc(100%-48px))] max-md:w-[min(620px,calc(100%-28px))]">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.08fr)_minmax(390px,0.92fr)] lg:items-start lg:gap-16">
          <div>
            <Tag
              className="gap-2 border-primary/15 bg-card/25 text-primary shadow-none"
              color="primary"
              shape="rounded"
              variant="soft"
            >
              <Component
                aria-hidden="true"
                size={15}
              />
              <span>SKYROC UI · COMPONENT SYSTEM</span>
            </Tag>

            <h1 className="mt-6 max-w-190 text-[clamp(44px,5.3vw,70px)] leading-[1.02] font-extrabold tracking-[-0.06em] max-md:text-[clamp(38px,10vw,48px)]">
              组件不是终点
              <span className="block text-primary">是产品界面的起点</span>
            </h1>

            <p className="mt-6 max-w-168 text-[16px] leading-7.5 text-muted-foreground max-md:text-[15px]">
              54 个可组合 React 组件，覆盖输入、展示、弹层、导航与反馈。每个组件都连接真实
              Demo、完整类型与使用边界，让团队从选型到交付保持同一套语言。
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button
                asChild
                className="transition-transform hover:-translate-y-0.5"
                color="primary"
                shape="rounded"
                shadow="lg"
              >
                <Link href="/components/button">
                  浏览全部组件
                  <ArrowRight
                    aria-hidden="true"
                    size={17}
                  />
                </Link>
              </Button>
              <InstallCommand />
            </div>

            <div className="mt-10 grid grid-cols-3 gap-5 border-t border-border/55 pt-6 max-sm:gap-3">
              {HOME_METRICS.map(item => (
                <div key={item.label}>
                  <strong className="block text-base font-bold tracking-tight text-foreground md:text-lg">
                    {item.value}
                  </strong>
                  <span className="mt-1 block font-mono text-[9px] font-bold tracking-[0.09em] text-muted-foreground uppercase">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <aside>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold tracking-[0.16em] text-primary uppercase">Start here</span>
                <h2 className="mt-1.5 text-xl font-bold tracking-[-0.03em]">从当前界面任务进入</h2>
              </div>
              <span className="flex size-9 items-center justify-center rounded-full border border-primary/15 bg-card/25 text-primary">
                <Braces
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
                    className="group grid min-h-21 grid-cols-[42px_1fr_auto] items-center gap-3 px-4 py-3 text-inherit transition-colors hover:bg-background/40"
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
                      <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <strong className="text-sm">{item.title}</strong>
                        <small className="font-mono text-[8px] tracking-wide text-muted-foreground">
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

            <div className="mt-4">
              <HeroComponentPreview />
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};
