import { ArrowRight, MonitorSmartphone, PackageOpen, Zap } from 'lucide-react';
import Link from 'next/link';

const READING_PATHS = [
  {
    description: '完成环境准备、依赖安装和应用启动，先确认本地开发链路正常。',
    eyebrow: '01 · 初次接入',
    href: '/docs/guide/getting-started/quick-start',
    icon: Zap,
    title: '搭起第一个 Admin 应用'
  },
  {
    description: '按启动、路由、权限、请求、布局与主题的顺序进入真实业务开发。',
    eyebrow: '02 · 开发功能',
    href: '/docs/admin',
    icon: MonitorSmartphone,
    title: '沿 Admin 调用链开发'
  },
  {
    description: '从应用用法继续追到 Core、Shared、Web Kit 的公开 API 与实现边界。',
    eyebrow: '03 · 深入源码',
    href: '/docs/packages',
    icon: PackageOpen,
    title: '向下追到包与源码'
  }
];

type ReadingPath = (typeof READING_PATHS)[number];

const ReadingPathCard = ({ description, eyebrow, href, icon: Icon, title }: ReadingPath) => {
  return (
    <Link
      className="group relative min-h-62 overflow-hidden bg-transparent p-6 text-inherit transition-colors duration-300 hover:bg-background/35"
      href={href}
    >
      <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        <Icon
          aria-hidden="true"
          size={20}
        />
      </div>

      <span className="mt-6 mb-2 block font-mono text-[9px] font-bold tracking-[0.1em] text-muted-foreground uppercase">
        {eyebrow}
      </span>

      <h3 className="text-lg font-semibold tracking-tight">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>

      <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-primary">
        进入阅读{' '}
        <ArrowRight
          className="transition-transform group-hover:translate-x-1"
          aria-hidden="true"
          size={15}
        />
      </span>
    </Link>
  );
};

export const ReadingPathsSection = () => {
  return (
    <section className="mx-auto w-[min(1180px,calc(100%-48px))] pt-22 md:pt-30 max-md:w-[min(620px,calc(100%-28px))]">
      <div className="mb-9 flex items-end justify-between gap-12 max-md:block">
        <div className="max-w-180">
          <span className="mb-3 block text-[10px] font-extrabold tracking-[0.16em] text-primary uppercase">
            Admin reading paths
          </span>

          <h2 className="text-[clamp(30px,3vw,42px)] leading-tight font-bold tracking-[-0.04em]">
            按 Admin 开发链路阅读
          </h2>
        </div>

        <p className="text-sm leading-7 text-muted-foreground lg:whitespace-nowrap max-md:mt-4">
          从当前任务进入，再沿应用依赖逐层深入。
        </p>
      </div>

      <div className="grid divide-y divide-border/50 overflow-hidden rounded-2xl border border-border/50 bg-card/25 shadow-sm md:grid-cols-3 md:divide-x md:divide-y-0">
        {READING_PATHS.map(item => (
          <ReadingPathCard
            {...item}
            key={item.title}
          />
        ))}
      </div>
    </section>
  );
};
