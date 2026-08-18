import { Tag } from '@skyroc/web-ui';
import { BentoShowcase } from '../components/BentoShowcase';
import { SectionHeading } from './SectionHeading';

export const ShowcaseSection = () => {
  return (
    <section className="relative isolate pt-20 md:pt-26">
      <div className="pointer-events-none absolute inset-x-0 top-16 -z-10 mx-auto h-105 max-w-5xl bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.055),transparent_68%)]" />

      <div className="mx-auto w-[min(1180px,calc(100%-48px))] max-md:w-[min(620px,calc(100%-28px))]">
        <SectionHeading
          action={
            <div className="mt-3 flex flex-wrap gap-2">
              <Tag color="primary">Form</Tag>
              <Tag color="success">Data</Tag>
              <Tag color="info">Feedback</Tag>
            </div>
          }
          description="文档中的组件不是静态截图。输入、切换、选择与状态反馈都能直接操作，先体验，再读 API。"
          eyebrow="LIVE COMPOSITION"
          title="把组件放进真实界面里理解"
        />

        <div className="rounded-[24px] border border-border/50 bg-card/18 p-3 shadow-sm sm:p-5">
          <BentoShowcase />
        </div>
      </div>
    </section>
  );
};
