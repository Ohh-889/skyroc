'use client';

import type { Root } from '@radix-ui/react-accordion';
import type { ComponentRef } from 'react';
import { forwardRef } from 'react';
import AccordionUI from '../../components/accordion/AccordionUI';
import type { AccordionProps } from '../../components/accordion/types';
import { useComponentConfig } from '../config-provider/context';

const Accordion = forwardRef<ComponentRef<typeof Root>, AccordionProps>((props, ref) => {
  const config = useComponentConfig('accordion');

  const mergedProps = {
    ...config,
    ...props
  };

  return (
    <AccordionUI
      {...mergedProps}
      ref={ref}
    />
  );
});

Accordion.displayName = 'Accordion';

export default Accordion;
