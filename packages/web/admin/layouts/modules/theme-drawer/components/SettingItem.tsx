import { clsx } from 'clsx';
import type { PropsWithChildren } from 'react';

type Props = PropsWithChildren<{
  /** Extra class name for the setting row. */
  className?: string;
  /** Label */
  label: React.ReactNode;
  /** Whether the row should be rendered. */
  show?: boolean;
  /** Extra content rendered beside the label. */
  suffix?: React.ReactNode;
}>;

const SettingItem = (props: Props) => {
  const { children, className, label, show = true, suffix } = props;

  if (!show) return null;

  return (
    <div className={clsx('w-full flex-y-center justify-between', className)}>
      <div className="flex-y-center">
        <span className="pr-8px text-base-text">{label}</span>
        {suffix}
      </div>
      {children}
    </div>
  );
};

export default SettingItem;
