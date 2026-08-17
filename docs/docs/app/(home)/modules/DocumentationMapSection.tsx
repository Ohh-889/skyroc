import {
  ArrowRight,
  Blocks,
  Boxes,
  Braces,
  Component,
  GitBranch,
  MonitorSmartphone,
  TerminalSquare,
  Wrench
} from 'lucide-react';
import Link from 'next/link';

const DOCUMENTATION_AREAS = [
  {
    className: 'border-b border-border/50 md:col-span-2',
    description: '从启动流程进入路由权限、请求服务、布局主题和常用业务能力。',
    href: '/docs/admin',
    icon: MonitorSmartphone,
    label: '39 topics · Application',
    title: 'Skyroc Admin 应用开发'
  },
  {
    className: 'border-b border-border/50 md:border-r',
    description: 'Monorepo、包分层、适配器模式、依赖方向与命名约定。',
    href: '/docs/architecture',
    icon: GitBranch,
    label: 'Architecture',
    title: '架构设计'
  },
  {
    className: 'border-b border-border/50',
    description: '请求、状态、调度、色彩、日志、类型与通用工具。',
    href: '/docs/packages/core/overview',
    icon: Braces,
    label: '23 topics · Core',
    title: 'Core 基础包'
  },
  {
    className: 'border-b border-border/50 md:border-b-0 md:border-r',
    description: '后台布局、运行时、多语言、主题与 Vite 工程预设。',
    href: '/docs/packages/web/overview',
    icon: Blocks,
    label: '21 topics · Web Kit',
    title: 'Web Kit'
  },
  {
    description: '架构约定、包开发、质量检查、构建发布与协作规范。',
    href: '/docs/engineering/overview',
    icon: Wrench,
    label: '10 topics · Engineering',
    title: '工程化'
  }
];

const ECOSYSTEM_LINKS = [
  { icon: Component, label: 'Web 组件 Demo 与 Props', title: 'Web UI' },
  { icon: Boxes, label: 'React Native 组件参考', title: 'Native UI' },
  { icon: TerminalSquare, label: 'Expo 真实运行示例', title: 'Playground' }
];

type DocumentationArea = (typeof DOCUMENTATION_AREAS)[number];

type EcosystemLink = (typeof ECOSYSTEM_LINKS)[number];

const DocumentationAreaCard = ({ className, description, href, icon: Icon, label, title }: DocumentationArea) => {
  return (
    <Link
      className={`group relative min-h-46 bg-transparent p-6 text-inherit transition-colors hover:bg-background/35 ${className ?? ''}`}
      href={href}
    >
      <div className="flex items-center justify-between">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon
            aria-hidden="true"
            size={20}
          />
        </div>
        <span className="text-[10px] font-extrabold tracking-[0.12em] text-muted-foreground uppercase">{label}</span>
      </div>
      <h3 className="mt-5 text-lg font-semibold tracking-tight">{title}</h3>
      <p className="mt-2 max-w-[84%] text-sm leading-6 text-muted-foreground">{description}</p>
      <ArrowRight
        className="absolute right-5 bottom-5 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-primary"
        aria-hidden="true"
        size={17}
      />
    </Link>
  );
};

const EcosystemLinkItem = ({ icon: Icon, label, title }: EcosystemLink) => {
  return (
    <div className="grid min-h-14 grid-cols-[34px_1fr] items-center gap-3 bg-transparent px-2.5 py-2">
      <div className="flex size-8.5 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon
          aria-hidden="true"
          size={18}
        />
      </div>
      <span className="flex flex-col">
        <strong className="text-xs">{title}</strong>
        <small className="mt-0.5 text-[10px] text-muted-foreground">{label}</small>
      </span>
    </div>
  );
};

export const DocumentationMapSection = () => {
  return (
    <section
      className="mx-auto w-[min(1180px,calc(100%-48px))] pt-20 md:pt-24 max-md:w-[min(620px,calc(100%-28px))]"
      id="documentation-map"
    >
      <div className="mb-9 flex items-end justify-between gap-12 max-md:block">
        <div>
          <span className="mb-3 block text-[10px] font-extrabold tracking-[0.16em] text-primary uppercase">
            Documentation map
          </span>

          <h2 className="text-[clamp(30px,3vw,42px)] leading-tight font-bold tracking-[-0.04em]">
            Admin 在中心，文档向下连接每一层
          </h2>
        </div>

        <Link
          className="mb-1 inline-flex items-center gap-2 text-xs font-bold text-primary max-md:mt-4"
          href="/docs"
        >
          查看全部文档
          <ArrowRight
            aria-hidden="true"
            size={16}
          />
        </Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_330px]">
        <div className="grid overflow-hidden rounded-2xl border border-border/50 bg-card/25 shadow-sm md:grid-cols-2">
          {DOCUMENTATION_AREAS.map(item => (
            <DocumentationAreaCard
              {...item}
              key={item.title}
            />
          ))}
        </div>

        <aside className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/25 p-7 shadow-sm max-lg:grid max-lg:grid-cols-[0.7fr_1.3fr] max-lg:gap-x-8 max-md:block">
          <div className="pointer-events-none absolute -top-20 -right-16 size-52 rounded-full bg-primary/10 blur-2xl" />

          <span className="relative text-[10px] font-extrabold tracking-[0.16em] text-primary">RELATED SITES</span>

          <h3 className="relative mt-4 text-xl font-semibold">组件与运行示例独立维护</h3>

          <p className="relative mt-2 text-sm leading-6 text-muted-foreground">
            主站聚焦 Skyroc Admin。组件 Demo 与 Expo 示例保留独立站点，通过统一导航互通。
          </p>

          <div className="relative mt-6 divide-y divide-border/50 overflow-hidden rounded-xl border border-border/50 max-lg:col-start-2 max-lg:row-start-1 max-lg:row-end-5 max-lg:mt-0 max-md:mt-6">
            {ECOSYSTEM_LINKS.map(item => (
              <EcosystemLinkItem
                {...item}
                key={item.title}
              />
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
};
