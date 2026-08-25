import classNames from 'clsx';

import type { ButtonTabProps } from '../../types';

import { useTap } from './hook';
import styles from './index.module.css';

const SliderTab = ({
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
        ':soy: relative inline-flex cursor-pointer items-center justify-center gap-6px whitespace-nowrap px-12px py-4px',
        [
          styles['slider-tab'],
          { [styles['slider-tab_dark']]: darkMode },
          { [styles['slider-tab_active']]: active },
          { [styles['slider-tab_active_dark']]: active && darkMode },
          className
        ]
      )}
      onClick={onClick}
    >
      {prefix}
      {children}
      {suffix}
    </div>
  );
};
export default SliderTab;
