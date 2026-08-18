import type { ReactNode } from 'react';

interface SectionHeadingProps {
  /** 标题右侧或下方的辅助操作 */
  action?: ReactNode;
  /** 对当前栏目价值的简短说明 */
  description: string;
  /** 用于建立页面节奏的英文栏目标签 */
  eyebrow: string;
  /** 当前栏目的主标题 */
  title: string;
}

export const SectionHeading = (props: SectionHeadingProps) => {
  const { action, description, eyebrow, title } = props;

  return (
    <div className="mb-9 flex items-end justify-between gap-12 max-md:block">
      <div className="max-w-180">
        <span className="mb-3 block text-[10px] font-extrabold tracking-[0.16em] text-primary uppercase">
          {eyebrow}
        </span>
        <h2 className="text-[clamp(30px,3vw,42px)] leading-tight font-bold tracking-[-0.045em]">{title}</h2>
      </div>

      <div className="max-w-112 text-sm leading-7 text-muted-foreground max-md:mt-4">
        <p>{description}</p>
        {action}
      </div>
    </div>
  );
};
