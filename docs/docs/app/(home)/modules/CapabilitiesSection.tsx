import { Blocks, Cable, Gauge, Layers3, Route, ShieldCheck } from 'lucide-react';

const CAPABILITIES = [
  {
    description: '从 bootstrap 到 Runtime Providers，讲清应用如何完成初始化与能力装配。',
    icon: Layers3,
    iconClassName: 'bg-primary/10 text-primary',
    title: '启动与运行时'
  },
  {
    description: '覆盖守卫、权限、Route Meta、缓存与异常页面的完整路由链路。',
    icon: Route,
    iconClassName: 'bg-info/10 text-info',
    title: '路由与权限'
  },
  {
    description: '从代理配置、请求实例到 Service Modules，保持接口调用边界清晰。',
    icon: Cable,
    iconClassName: 'bg-success/10 text-success',
    title: '请求与服务模块'
  },
  {
    description: '菜单、页签、布局插槽、设计令牌与 Ant Design 主题在同一套运行时协作。',
    icon: Blocks,
    iconClassName: 'bg-warning/10 text-warning',
    title: '后台布局与主题'
  },
  {
    description: 'Core、Shared 与 Web Kit 分层提供请求、状态、工具和后台平台能力。',
    icon: ShieldCheck,
    iconClassName: 'bg-destructive/10 text-destructive',
    title: '公共包边界'
  },
  {
    description: 'Vite、Turborepo、Oxlint 与 Oxfmt 负责开发、构建和质量检查。',
    icon: Gauge,
    iconClassName: 'bg-primary/10 text-primary',
    title: '工程与质量链路'
  }
];

type Capability = (typeof CAPABILITIES)[number];

const CapabilityCard = ({ description, icon: Icon, iconClassName, title }: Capability) => {
  return (
    <article className="group flex min-h-40 gap-4 border-b border-border/60 py-6">
      <div
        className={`mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:-translate-y-0.5 ${iconClassName}`}
      >
        <Icon
          aria-hidden="true"
          size={21}
        />
      </div>
      <div>
        <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
    </article>
  );
};

export const CapabilitiesSection = () => {
  return (
    <section className="relative isolate pt-20 md:pt-24">
      <div className="pointer-events-none absolute inset-x-0 top-16 -z-10 mx-auto h-105 max-w-5xl bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.05),transparent_68%)]" />

      <div className="mx-auto w-[min(1180px,calc(100%-48px))] max-md:w-[min(620px,calc(100%-28px))]">
        <div className="mb-9 flex items-end justify-between gap-12 max-md:block">
          <div>
            <span className="mb-3 block text-[10px] font-extrabold tracking-[0.16em] text-primary uppercase">
              Inside Skyroc Admin
            </span>
            <h2 className="text-[clamp(30px,3vw,42px)] leading-tight font-bold tracking-[-0.04em]">
              Skyroc Admin 如何运转
            </h2>
          </div>
          <p className="text-sm leading-7 text-muted-foreground lg:whitespace-nowrap max-md:mt-4">
            从应用装配到公共包实现，都有对应的指南与 API 参考。
          </p>
        </div>

        <div className="grid gap-x-10 border-t border-border/60 md:grid-cols-2 lg:grid-cols-3">
          {CAPABILITIES.map(item => (
            <CapabilityCard
              {...item}
              key={item.title}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
