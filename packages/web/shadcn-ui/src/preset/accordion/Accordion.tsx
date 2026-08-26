'use client';

import type { ComponentRef } from 'react';
import { forwardRef } from 'react';
import type { Root } from '@radix-ui/react-accordion';
import { useComponentConfig } from '../config-provider/context';
import AccordionUI from '../../components/accordion/AccordionUI';
import type { AccordionProps } from '../../components/accordion/types';

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
