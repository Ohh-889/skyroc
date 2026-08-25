import classNames from 'clsx';

import type { ButtonTabProps } from '../../types';

import ChromeTabBg from './ChromeTabBg';
import { useTap } from './hook';
import styles from './index.module.css';

const ChromeTab = ({
  active,
  children,
  className,
  darkMode,
  onClick,
  prefix,
  style,
  suffix,
  ...rest
}: ButtonTabProps) => {
  const tap = useTap(onClick);

  return (
    <div
      {...rest}
      {...tap}
      style={{ ...style }}
      className={classNames(
        ':soy: relative inline-flex cursor-pointer items-center justify-center gap-16px whitespace-nowrap px-24px py-6px -mr-18px',
        [
          styles['chrome-tab'],
          { [styles['chrome-tab_dark']]: darkMode },
          { [styles['chrome-tab_active']]: active },
          { [styles['chrome-tab_active_dark']]: active && darkMode },
          className
        ]
      )}
      onClick={onClick}
    >
      <div
        className={classNames(':soy: pointer-events-none absolute left-0 top-0 h-full w-full -z-1', [
          styles['chrome-tab__bg']
        ])}
      >
        <ChromeTabBg />
      </div>
      {prefix}
      {children}
      {suffix}
      <div className={classNames(':soy: absolute right-7px h-16px w-1px bg-#1f2225', [styles['chrome-tab-divider']])} />
    </div>
  );
};

export default ChromeTab;
