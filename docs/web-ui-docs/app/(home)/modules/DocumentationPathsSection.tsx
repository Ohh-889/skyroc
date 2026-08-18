import { ArrowRight, Code2, GitBranch, PackageOpen } from 'lucide-react';
import Link from 'next/link';
import { DOCUMENTATION_PATHS } from '../home-data';
import { SectionHeading } from './SectionHeading';

export const DocumentationPathsSection = () => {
  return (
    <section className="mx-auto w-[min(1180px,calc(100%-48px))] pt-20 pb-20 md:pt-26 md:pb-24 max-md:w-[min(620px,calc(100%-28px))]">
      <SectionHeading
        description="组件 API 解决“怎么用”，体系文档继续回答“为什么这样选”和“如何在业务里组合”。"
        eyebrow="DOCUMENTATION PATHS"
        title="从第一个组件走向完整界面"
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="grid divide-y divide-border/50 overflow-hidden rounded-2xl border border-border/50 bg-card/25 shadow-sm md:grid-cols-3 md:divide-x md:divide-y-0">
          {DOCUMENTATION_PATHS.map(item => {
            const Icon = item.icon;

            return (
              <Link
                className="group relative min-h-64 p-6 text-inherit transition-colors hover:bg-background/40"
                href={item.href}
                key={item.title}
              >
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon
                    aria-hidden="true"
                    size={20}
                  />
                </span>
                <span className="mt-6 block font-mono text-[9px] font-bold tracking-[0.1em] text-muted-foreground">
                  {item.label}
                </span>
                <h3 className="mt-2 text-lg font-semibold tracking-tight">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
                <ArrowRight
                  aria-hidden="true"
                  className="absolute right-5 bottom-5 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-primary"
                  size={17}
                />
              </Link>
            );
          })}
        </div>

        <aside className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/25 p-7 shadow-sm">
          <div className="pointer-events-none absolute -top-20 -right-16 size-52 rounded-full bg-primary/10 blur-2xl" />
          <span className="relative font-mono text-[9px] font-extrabold tracking-[0.16em] text-primary">
            SOURCE FIRST
          </span>
          <h3 className="relative mt-4 text-xl font-semibold tracking-tight">Demo、类型与实现保持同源</h3>
          <p className="relative mt-3 text-sm leading-6 text-muted-foreground">
            每篇组件文档直接加载 Playground 源码，并把 Props、类型定义与组件实现放在同一条维护链路里。
          </p>

          <div className="relative mt-6 divide-y divide-border/50 overflow-hidden rounded-xl border border-border/50 bg-background/45">
            <div className="grid min-h-15 grid-cols-[34px_1fr] items-center gap-3 px-3 py-2.5">
              <span className="flex size-8.5 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Code2
                  aria-hidden="true"
                  size={17}
                />
              </span>
              <span>
                <strong className="block text-xs">Live Demo</strong>
                <small className="mt-0.5 block text-[10px] text-muted-foreground">预览与源码随时切换</small>
              </span>
            </div>
            <div className="grid min-h-15 grid-cols-[34px_1fr] items-center gap-3 px-3 py-2.5">
              <span className="flex size-8.5 items-center justify-center rounded-lg bg-success/10 text-success">
                <PackageOpen
                  aria-hidden="true"
                  size={17}
                />
              </span>
              <span>
                <strong className="block text-xs">Typed API</strong>
                <small className="mt-0.5 block text-[10px] text-muted-foreground">属性、默认值与类型可扫描</small>
              </span>
            </div>
            <a
              className="grid min-h-15 grid-cols-[34px_1fr_auto] items-center gap-3 px-3 py-2.5 text-inherit transition-colors hover:bg-primary/6"
              href="https://github.com/soybeanjs/soybean-admin-react"
              rel="noreferrer"
              target="_blank"
            >
              <span className="flex size-8.5 items-center justify-center rounded-lg bg-info/10 text-info">
                <GitBranch
                  aria-hidden="true"
                  size={17}
                />
              </span>
              <span>
                <strong className="block text-xs">Source Code</strong>
                <small className="mt-0.5 block text-[10px] text-muted-foreground">回到真实实现继续深入</small>
              </span>
              <ArrowRight
                aria-hidden="true"
                className="text-muted-foreground"
                size={15}
              />
            </a>
          </div>
        </aside>
      </div>
    </section>
  );
};
