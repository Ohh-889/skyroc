import type { LucideIcon } from 'lucide-react';
import {
  ArrowUpRight,
  Blocks,
  BookOpen,
  CornerDownRight,
  DatabaseZap,
  GitBranch,
  Languages,
  LayoutGrid,
  LockKeyhole,
  Palette,
  Route,
  Terminal,
  Workflow
} from 'lucide-react';
import type { Metadata } from 'next';
import { Bricolage_Grotesque, JetBrains_Mono } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';

const display = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-display'
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono'
});

export const metadata: Metadata = {
  title: 'Skyroc Admin React 文档',
  description: 'Skyroc Admin React 新版开发文档'
};

interface HomePageProps {
  /** 首页当前不消费路由参数，保留 props 入口便于后续扩展。 */
  params?: never;
}

interface StackItem {
  /** 技术栈展示名称。 */
  label: string;
  /** 角色注解，挂在名称右侧的灰字。 */
  role: string;
}

interface FeatureItem {
  /** 功能标题。 */
  title: string;
  /** 功能说明。 */
  description: string;
  /** 功能图标。 */
  icon: LucideIcon;
  /** 关联的源码路径标签。 */
  tag: string;
  /** Bento 网格跨列样式，控制卡片大小。 */
  span: string;
}

interface GuideItem {
  /** 文档入口路径。 */
  href: string;
  /** 入口序号。 */
  index: string;
  /** 入口标题。 */
  title: string;
  /** 入口说明。 */
  description: string;
  /** 入口图标。 */
  icon: LucideIcon;
}

interface MetricItem {
  /** 指标数值。 */
  value: string;
  /** 指标说明。 */
  label: string;
}

const stackItems: readonly StackItem[] = [
  { label: 'React 19', role: 'core' },
  { label: 'Vite', role: 'bundler' },
  { label: 'TypeScript', role: 'types' },
  { label: 'TanStack Router', role: 'routing' },
  { label: 'React Query', role: 'data' },
  { label: 'Jotai', role: 'state' },
  { label: 'Ant Design', role: 'ui' },
  { label: 'UnoCSS', role: 'styling' }
];

const metricItems: readonly MetricItem[] = [
  { value: '29', label: '正文页面' },
  { value: '7', label: '专题模块' },
  { value: '100%', label: '源码事实导向' }
];

const featureItems: readonly FeatureItem[] = [
  {
    title: '文件路由系统',
    description: '约定式页面结构生成 route tree，菜单、标题与权限随页面同步演进，无需手写路由表。',
    icon: Route,
    tag: 'routeTree.gen.ts',
    span: 'lg:col-span-3 lg:row-span-2'
  },
  {
    title: '权限与菜单',
    description: '登录守卫、静态权限、动态菜单与超级角色由启动层统一接入。',
    icon: LockKeyhole,
    tag: 'guards / permissions',
    span: 'lg:col-span-3'
  },
  {
    title: '请求服务分层',
    description: 'urls、api、hooks、keys、types 拆分清晰，页面直接复用服务 hooks。',
    icon: DatabaseZap,
    tag: 'service modules',
    span: 'lg:col-span-3'
  },
  {
    title: '主题与国际化',
    description: '暗色模式、主题色、Ant Design 适配、本地图标与语言包统一管理。',
    icon: Palette,
    tag: 'theme / i18n',
    span: 'lg:col-span-2'
  },
  {
    title: 'Monorepo 能力',
    description: 'layouts、theme、i18n、notification 以 workspace 包复用。',
    icon: Blocks,
    tag: '@skyroc/web-admin-*',
    span: 'lg:col-span-2'
  },
  {
    title: '开发工具链',
    description: 'Vite、pnpm、类型检查与 devtools 保持清晰启动顺序。',
    icon: Workflow,
    tag: 'tooling',
    span: 'lg:col-span-2'
  }
];

const guideItems: readonly GuideItem[] = [
  {
    href: '/docs/getting-started/quick-start',
    index: '01',
    title: '快速开始',
    description: '安装依赖、启动开发环境、构建和预览。',
    icon: Terminal
  },
  {
    href: '/docs/architecture/bootstrap',
    index: '02',
    title: '启动流程',
    description: '理解 main、bootstrap、App 与 Provider 顺序。',
    icon: GitBranch
  },
  {
    href: '/docs/routing/overview',
    index: '03',
    title: '路由与菜单',
    description: '新增页面、配置菜单、处理权限与外链。',
    icon: LayoutGrid
  }
];

const HomePage = (props: HomePageProps) => {
  const { params } = props;
  void params;

  return (
    <main
      className={`skyroc-home ${display.variable} ${mono.variable} relative min-h-screen overflow-x-hidden bg-[#fbfbfe] text-slate-900 dark:bg-[#06060d] dark:text-slate-100`}
    >
      {/* 蓝图栅格 + 噪点质感底纹 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(to_right,rgba(15,23,42,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.045)_1px,transparent_1px)] bg-[size:46px_46px] [mask-image:radial-gradient(ellipse_80%_55%_at_50%_0%,black_55%,transparent_100%)] dark:bg-[linear-gradient(to_right,rgba(148,163,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,255,0.06)_1px,transparent_1px)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-20 h-[640px] bg-[radial-gradient(60%_60%_at_72%_8%,rgba(6,182,212,0.16),transparent_60%),radial-gradient(58%_58%_at_28%_2%,rgba(100,108,255,0.22),transparent_62%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.04] [background-image:var(--sk-grain)] dark:opacity-[0.07]"
      />

      {/* ===== Hero：非对称双栏 ===== */}
      <section className="mx-auto w-full max-w-7xl px-5 pb-16 pt-14 sm:px-6 lg:px-8 lg:pb-24 lg:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
          {/* 左：文案 */}
          <div className="flex flex-col items-start">
            <div
              data-reveal
              className="inline-flex items-center gap-2 rounded-full border border-[#646cff]/25 bg-[#646cff]/8 py-1.5 pl-1.5 pr-3 text-xs font-medium text-[#4b51d6] backdrop-blur dark:border-[#646cff]/30 dark:bg-[#646cff]/12 dark:text-[#b8bcff]"
            >
              <span className="flex size-6 items-center justify-center rounded-full bg-white shadow-sm dark:bg-white/10">
                <Image
                  src="/skyroc-logo.svg"
                  alt=""
                  width={14}
                  height={14}
                  aria-hidden="true"
                />
              </span>
              <span className="font-[family-name:var(--font-mono)] tracking-tight">v · 源码事实导向</span>
            </div>

            <h1
              data-reveal
              className="mt-7 font-[family-name:var(--font-display)] text-[2.9rem] font-extrabold leading-[1.02] tracking-tight text-slate-950 sm:text-6xl lg:text-[4.4rem] dark:text-white"
              style={{ animationDelay: '80ms' }}
            >
              把后台开发
              <br />
              收敛成
              <span className="relative ml-3 inline-block">
                <span className="skyroc-sheen bg-[linear-gradient(110deg,#646cff,45%,#06b6d4,55%,#646cff)] bg-clip-text text-transparent">
                  一套约定
                </span>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 300 14"
                  className="absolute -bottom-2 left-0 h-3 w-full text-[#06b6d4]"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M2 9 C 80 2, 220 2, 298 8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            <p
              data-reveal
              className="mt-8 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-400"
              style={{ animationDelay: '160ms' }}
            >
              面向{' '}
              <code className="rounded bg-slate-900/5 px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-[0.85em] text-[#4b51d6] dark:bg-white/8 dark:text-[#b8bcff]">
                apps/admin
              </code>{' '}
              的新版开发文档。按真实源码讲清启动、路由、权限、请求、主题、通知与部署边界。
            </p>

            <div
              data-reveal
              className="mt-9 flex flex-col gap-3 sm:flex-row"
              style={{ animationDelay: '240ms' }}
            >
              <Link
                href="/docs/getting-started/quick-start"
                className="group inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#646cff] px-6 text-sm font-semibold text-white shadow-[0_18px_44px_-12px_rgba(100,108,255,0.7)] transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-[#535bf2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#646cff]"
              >
                开始使用
                <ArrowUpRight
                  className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </Link>
              <Link
                href="/docs"
                className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-300/80 bg-white/70 px-6 text-sm font-semibold text-slate-800 backdrop-blur transition-colors duration-200 hover:border-[#646cff]/45 hover:text-[#4b51d6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#646cff] dark:border-white/15 dark:bg-white/5 dark:text-slate-100 dark:hover:border-[#646cff]/50 dark:hover:text-white"
              >
                <BookOpen
                  className="size-4"
                  aria-hidden="true"
                />
                查看文档
              </Link>
            </div>

            <dl
              data-reveal
              className="mt-12 flex flex-wrap gap-x-10 gap-y-5"
              style={{ animationDelay: '320ms' }}
            >
              {metricItems.map(metric => (
                <div
                  key={metric.label}
                  className="flex flex-col"
                >
                  <dt className="order-2 mt-1 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-500">
                    {metric.label}
                  </dt>
                  <dd className="order-1 font-[family-name:var(--font-display)] text-3xl font-bold text-slate-950 dark:text-white">
                    {metric.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* 右：拟真编辑器窗口 */}
          <div
            data-reveal
            className="relative"
            style={{ animationDelay: '200ms' }}
          >
            <div
              aria-hidden="true"
              className="skyroc-float absolute -right-4 -top-6 hidden rounded-xl border border-[#06b6d4]/30 bg-white/85 px-3.5 py-2.5 shadow-xl shadow-[#06b6d4]/10 backdrop-blur md:block dark:border-[#06b6d4]/30 dark:bg-white/10"
            >
              <p className="font-[family-name:var(--font-mono)] text-[11px] text-[#06b6d4]">pnpm dev</p>
              <p className="font-[family-name:var(--font-mono)] text-[11px] text-slate-500 dark:text-slate-400">
                ready in 312 ms
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-[#0d1021] shadow-[0_40px_90px_-30px_rgba(15,23,42,0.55)] dark:border-white/10">
              <div className="flex items-center gap-2 border-b border-white/8 bg-white/[0.03] px-4 py-3">
                <span className="size-3 rounded-full bg-[#ff5f57]" />
                <span className="size-3 rounded-full bg-[#febc2e]" />
                <span className="size-3 rounded-full bg-[#28c840]" />
                <span className="ml-3 font-[family-name:var(--font-mono)] text-[11px] text-slate-400">
                  apps/admin/src
                </span>
              </div>
              <pre className="overflow-x-auto px-5 py-5 font-[family-name:var(--font-mono)] text-[12.5px] leading-[1.85] text-slate-300">
                <code>
                  <span className="text-[#6b7280]">{'// 约定式页面 → 自动生成路由'}</span>
                  {'\n'}
                  <span className="text-[#c084fc]">export</span> <span className="text-[#c084fc]">const</span>{' '}
                  <span className="text-[#7dd3fc]">Route</span> ={' '}
                  <span className="text-[#7dd3fc]">createFileRoute</span>({'\n'}
                  {'  '}
                  <span className="text-[#a3e635]">{"'/(base)/home'"}</span>
                  {'\n'})({'{'}
                  {'\n'}
                  {'  '}
                  <span className="text-[#7dd3fc]">component</span>: <span className="text-[#7dd3fc]">HomePage</span>,
                  {'\n'}
                  {'  '}
                  <span className="text-[#7dd3fc]">meta</span>: {'{'} <span className="text-[#7dd3fc]">title</span>:{' '}
                  <span className="text-[#a3e635]">{"'home'"}</span>, <span className="text-[#7dd3fc]">icon</span>:{' '}
                  <span className="text-[#a3e635]">{"'mdi:home'"}</span> {'}'}
                  {'\n'}
                  {'}'});
                  {'\n\n'}
                  <span className="text-[#6b7280]">{'// 服务 hooks 直接复用'}</span>
                  {'\n'}
                  <span className="text-[#c084fc]">const</span> {'{'} <span className="text-[#e5e7eb]">data</span> {'}'}{' '}
                  = <span className="text-[#7dd3fc]">useUserList</span>(<span className="text-[#fbbf24]">params</span>)
                  <span className="skyroc-blink text-[#646cff]">▋</span>
                </code>
              </pre>
            </div>
          </div>
        </div>

        {/* ===== 技术栈跑马灯 ===== */}
        <div
          data-reveal
          className="relative mt-16 overflow-hidden"
          style={{ animationDelay: '400ms' }}
        >
          <p className="mb-5 text-center text-xs font-medium uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
            Built on a modern stack
          </p>
          <div className="relative [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
            <div className="skyroc-marquee-track flex w-max gap-3">
              {[...stackItems, ...stackItems].map((item, index) => (
                <span
                  key={`${item.label}-${index}`}
                  className="flex shrink-0 items-center gap-2 rounded-full border border-slate-200/80 bg-white/70 px-4 py-2 text-sm font-medium text-slate-700 backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                >
                  {item.label}
                  <span className="font-[family-name:var(--font-mono)] text-[11px] text-slate-400 dark:text-slate-500">
                    {item.role}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== 功能 Bento 网格 ===== */}
      <section className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="flex flex-col gap-3">
          <p className="font-[family-name:var(--font-mono)] text-sm text-[#06b6d4]">// core_features</p>
          <h2 className="max-w-2xl font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl dark:text-white">
            强大功能，清晰边界
          </h2>
          <p className="max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-400">
            首页只放导读，具体实现进入文档页后按源码路径展开。
          </p>
        </div>

        <div className="mt-12 grid auto-rows-[minmax(0,1fr)] gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {featureItems.map(item => {
            const Icon = item.icon;

            return (
              <article
                key={item.title}
                className={`group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 p-6 backdrop-blur transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-[#646cff]/45 hover:shadow-[0_24px_60px_-30px_rgba(100,108,255,0.55)] dark:border-white/10 dark:bg-white/[0.035] dark:hover:border-[#646cff]/45 ${item.span}`}
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-12 -top-12 size-32 rounded-full bg-[radial-gradient(circle,rgba(100,108,255,0.16),transparent_70%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
                <div className="flex size-11 items-center justify-center rounded-xl border border-[#646cff]/15 bg-gradient-to-br from-[#646cff]/12 to-[#06b6d4]/10 text-[#4b51d6] dark:border-[#646cff]/25 dark:text-[#b8bcff]">
                  <Icon
                    className="size-5"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="mt-5 font-[family-name:var(--font-display)] text-lg font-bold text-slate-950 dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-400">{item.description}</p>
                <p className="mt-5 inline-flex w-fit items-center gap-1.5 rounded-md bg-slate-900/5 px-2 py-1 font-[family-name:var(--font-mono)] text-[11px] text-slate-500 dark:bg-white/5 dark:text-slate-400">
                  <CornerDownRight
                    className="size-3"
                    aria-hidden="true"
                  />
                  {item.tag}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      {/* ===== 进入开发路径 ===== */}
      <section className="relative border-t border-slate-200/80 dark:border-white/10">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-16 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8 lg:py-24">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <p className="font-[family-name:var(--font-mono)] text-sm text-[#06b6d4]">// read_next</p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl dark:text-white">
              从这里进入开发路径
            </h2>
            <p className="mt-4 max-w-md text-base leading-7 text-slate-600 dark:text-slate-400">
              先跑起来，再看启动链路与路由菜单。首页少讲概念，文档页讲清楚真实代码。
            </p>
            <div className="mt-7 flex items-center gap-2 font-[family-name:var(--font-mono)] text-xs text-slate-400 dark:text-slate-500">
              <Languages
                className="size-3.5"
                aria-hidden="true"
              />
              i18n · theme · notification 均已就绪
            </div>
          </div>

          <ol className="grid gap-4">
            {guideItems.map(item => {
              const Icon = item.icon;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group flex cursor-pointer items-center gap-5 rounded-2xl border border-slate-200/80 bg-white/80 p-5 backdrop-blur transition-[transform,border-color] duration-200 hover:-translate-y-0.5 hover:border-[#646cff]/45 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#646cff] dark:border-white/10 dark:bg-white/[0.035] dark:hover:border-[#646cff]/45"
                  >
                    <span className="font-[family-name:var(--font-display)] text-2xl font-bold text-slate-300 transition-colors duration-200 group-hover:text-[#646cff] dark:text-white/15 dark:group-hover:text-[#b8bcff]">
                      {item.index}
                    </span>
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#646cff] to-[#535bf2] text-white shadow-[0_12px_30px_-12px_rgba(100,108,255,0.8)]">
                      <Icon
                        className="size-5"
                        aria-hidden="true"
                      />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-[family-name:var(--font-display)] text-lg font-bold text-slate-950 dark:text-white">
                        {item.title}
                      </span>
                      <span className="mt-1 block text-sm leading-6 text-slate-600 dark:text-slate-400">
                        {item.description}
                      </span>
                    </span>
                    <ArrowUpRight
                      className="size-5 shrink-0 text-slate-400 transition-[color,transform] duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#646cff]"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
