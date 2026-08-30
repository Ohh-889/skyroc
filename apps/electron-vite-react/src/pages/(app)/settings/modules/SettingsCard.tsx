import { Icon } from '@skyroc/web-ui';
import type { ReactNode } from 'react';

interface SettingRowProps {
  /** 设置项右侧的操作控件。 */
  children: ReactNode;
  /** 设置项的辅助说明。 */
  description: string;
  /** 是否使用危险操作样式。 */
  destructive?: boolean;
  /** 设置项标题。 */
  title: string;
}

interface SectionHeaderProps {
  /** 分区的辅助说明。 */
  description: string;
  /** 是否使用危险分区的语义色。 */
  destructive?: boolean;
  /** 分区标题前的图标。 */
  icon: string;
  /** 分区名称。 */
  title: string;
}

interface SettingsGroupProps extends SectionHeaderProps {
  /** 分区包含的设置项。 */
  children: ReactNode;
}

export const SettingRow = (props: SettingRowProps) => {
  const { children, description, destructive = false, title } = props;

  return (
    <div className="flex min-h-19 items-center justify-between gap-8 px-5 py-4">
      <div className="min-w-0">
        <h3 className={`text-[13px] font-semibold ${destructive ? 'text-destructive' : 'text-foreground'}`}>{title}</h3>
        <p className="mt-1 max-w-xl text-[11px] leading-5 text-muted-foreground">{description}</p>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
};

export const SectionHeader = (props: SectionHeaderProps) => {
  const { description, destructive = false, icon, title } = props;

  return (
    <div className="flex items-start gap-3 border-b border-border px-5 py-5">
      <span
        className={`grid size-9 shrink-0 place-items-center rounded-xl ${
          destructive ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'
        }`}
      >
        <Icon
          height="17"
          icon={icon}
          width="17"
        />
      </span>
      <div>
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        <p className="mt-1 text-[11px] text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

export const SettingsGroup = (props: SettingsGroupProps) => {
  const { children, description, destructive = false, icon, title } = props;

  return (
    <div
      className={`overflow-hidden rounded-[22px] border shadow-sm ${
        destructive ? 'border-destructive/30 bg-destructive/5' : 'border-border bg-card'
      }`}
    >
      <SectionHeader
        description={description}
        destructive={destructive}
        icon={icon}
        title={title}
      />
      {children}
    </div>
  );
};
