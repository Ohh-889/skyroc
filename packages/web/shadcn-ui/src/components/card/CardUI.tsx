'use client';

import React from 'react';
import { CardContent } from './CardContent';
import { CardFooter } from './CardFooter';
import { CardHeader } from './CardHeader';
import { CardRoot } from './CardRoot';
import { CardTitle } from './CardTitle';
import { CardTitleRoot } from './CardTitleRoot';
import type { CardProps } from './types';

export const CardUI = React.forwardRef<HTMLDivElement, CardProps>((props, ref) => {
  const {
    children,
    className,
    classNames,
    contentProps,
    extra,
    footer,
    footerProps,
    header,
    headerProps,
    scrollable,
    size,
    split,
    title,
    titleLeading,
    titleProps,
    titleRoot,
    titleRootProps,
    titleTrailing,
    ...rest
  } = props;

  const showHeader = Boolean(header || title || extra);

  return (
    <CardRoot className={className || classNames?.root} size={size} split={split} {...rest} ref={ref}>
      {showHeader ? (
        <CardHeader className={classNames?.header} size={size} {...headerProps}>
          {header || (
            <>
              {titleRoot || (
                <CardTitleRoot className={classNames?.titleRoot} size={size} {...titleRootProps}>
                  {titleLeading}

                  {typeof title === 'string' || typeof title === 'number' ? (
                    <CardTitle className={classNames?.title} size={size} {...titleProps}>
                      {title}
                    </CardTitle>
                  ) : (
                    title
                  )}

                  {titleTrailing}
                </CardTitleRoot>
              )}

              {extra}
            </>
          )}
        </CardHeader>
      ) : null}

      <CardContent className={classNames?.content} scrollable={scrollable} size={size} {...contentProps}>
        {children}
      </CardContent>

      {typeof footer === 'string' || typeof footer === 'number' ? (
        <CardFooter className={classNames?.footer} size={size} {...footerProps}>
          {footer}
        </CardFooter>
      ) : (
        footer
      )}
    </CardRoot>
  );
});

CardUI.displayName = 'CardUI';
