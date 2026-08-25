import classNames from 'clsx';
import React, { memo } from 'react';
import type { FC } from 'react';

import type { ButtonTabProps } from '../../types';

import ButtonTab from './ButtonTab';
import ChromeTab from './ChromeTab';
import { ACTIVE_COLOR, createTabCssVars } from './shared';
import SliderTab from './SliderTab';
import SvgClose from './SvgClose';
import styles from './index.module.css';

type PageTabProps = Omit<ButtonTabProps, 'onMouseUp'>;

const PageTab: FC<PageTabProps> = ({
  active,
  activeColor = ACTIVE_COLOR,
  buttonClass,
  children,
  chromeClass,
  className,
  closable = true,
  darkMode,
  handleClose,
  mode = 'chrome',
  prefix,
  sliderClass,
  style,
  suffix,
  ...rest
}) => {
  const cssVars = createTabCssVars(activeColor) as React.CSSProperties;

  const getActiveTabComponent = {
    button: {
      class: buttonClass,
      component: ButtonTab
    },
    chrome: {
      class: chromeClass,
      component: ChromeTab
    },
    slider: {
      class: sliderClass,
      component: SliderTab
    }
  };

  const ActiveTabComponent = getActiveTabComponent[mode].component;

  const activeClass = getActiveTabComponent[mode].class;

  function closeTab(event: React.MouseEvent | TouchEvent) {
    event.stopPropagation();
    if (handleClose) handleClose();
  }

  const suffixComponent = suffix || (closable && <SvgClose className={styles['svg-close']} onClick={closeTab} />);

  return (
    <ActiveTabComponent
      active={active}
      className={classNames(activeClass, className)}
      darkMode={darkMode}
      prefix={prefix}
      style={{ ...cssVars, ...style }}
      suffix={suffixComponent}
      {...rest}
    >
      {children}
    </ActiveTabComponent>
  );
};

export default memo(PageTab);
