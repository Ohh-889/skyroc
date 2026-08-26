'use client';

import type { ComponentRef } from 'react';
import { forwardRef } from 'react';
import type { Root } from '@radix-ui/react-accordion';
import AccordionContent from './AccordionContent';
import AccordionHeader from './AccordionHeader';
import AccordionItem from './AccordionItem';
import AccordionRoot from './AccordionRoot';
import AccordionTrigger from './AccordionTrigger';
import type { AccordionProps } from './types';

const AccordionUI = forwardRef<ComponentRef<typeof Root>, AccordionProps>((props, ref) => {
  const { className, classNames, contentProps, dir, headerProps, itemProps, items, size, triggerIcon, triggerLeading, triggerProps, triggerTrailing, ...rest } = props;

  return (
    <AccordionRoot
      className={className || classNames?.root}
      ref={ref}
      {...rest}
    >
      {items.map(item => (
        <AccordionItem
          className={classNames?.item}
          dir={dir}
          disabled={item.disabled}
          key={item.value}
          value={item.value}
          {...itemProps}
        >
          <AccordionHeader
            className={classNames?.header}
            dir={dir}
            {...headerProps}
          >
            <AccordionTrigger
              className={classNames?.trigger}
              classNames={classNames}
              dir={dir}
              icon={triggerIcon}
              leading={item.leading || triggerLeading}
              size={size}
              trailing={item.trailing || triggerTrailing}
              {...triggerProps}
            >
              {item.title}
            </AccordionTrigger>
          </AccordionHeader>

          <AccordionContent
            className={classNames?.content}
            dir={dir}
            size={size}
            {...contentProps}
          >
            {item.children}
          </AccordionContent>
        </AccordionItem>
      ))}
    </AccordionRoot>
  );
});
AccordionUI.displayName = 'AccordionUI';

export default AccordionUI;