import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { COMPONENT_CATEGORIES } from '../home-data';
import { SectionHeading } from './SectionHeading';

export const ComponentMapSection = () => {
  return (
    <section className="mx-auto w-[min(1180px,calc(100%-48px))] pt-20 md:pt-26 max-md:w-[min(620px,calc(100%-28px))]">
      <SectionHeading
        description="先按界面意图缩小范围，再进入组件页查看交互 Demo、关键用法和完整 API。"
        eyebrow="COMPONENT MAP"
        title="按界面任务找到正确组件"
      />

      <div className="grid overflow-hidden rounded-2xl border border-border/50 bg-card/25 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
        {COMPONENT_CATEGORIES.map((category, index) => {
          const Icon = category.icon;
          const hasRightBorder = index % 4 !== 3;
          const hasBottomBorder = index < 4;

          return (
            <Link
              className={`group relative min-h-62 p-5 text-inherit transition-colors hover:bg-background/40 ${
                hasRightBorder ? 'lg:border-r lg:border-border/50' : ''
              } ${hasBottomBorder ? 'lg:border-b lg:border-border/50' : ''} border-b border-border/50 sm:odd:border-r sm:odd:border-border/50`}
              href={category.href}
              key={category.title}
            >
              <div className="flex items-start justify-between">
                <span className={`flex size-10 items-center justify-center rounded-xl ${category.accentClassName}`}>
                  <Icon
                    aria-hidden="true"
                    size={20}
                  />
                </span>
                <ArrowRight
                  aria-hidden="true"
                  className="text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-primary"
                  size={16}
                />
              </div>

              <h3 className="mt-5 text-lg font-semibold tracking-tight">{category.title}</h3>
              <p className="mt-2 min-h-12 text-sm leading-6 text-muted-foreground">{category.description}</p>

              <div className="mt-5 flex flex-wrap gap-1.5">
                {category.items.map(item => (
                  <span
                    className="rounded-md border border-border/55 bg-background/55 px-2 py-1 font-mono text-[9px] text-muted-foreground transition-colors group-hover:border-primary/20 group-hover:text-foreground"
                    key={item}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
