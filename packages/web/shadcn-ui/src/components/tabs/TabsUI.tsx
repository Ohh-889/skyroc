'use client';

import type { ComponentRef } from 'react';
import { forwardRef } from 'react';
import TabsContent from './TabsContent';
import TabsList from './TabsList';
import Root from './TabsRoot';
import TabsTrigger from './TabsTrigger';
import type { TabsOptionData, TabsProps } from './types';

const TabsUI = forwardRef<ComponentRef<typeof Root>, TabsProps<TabsOptionData>>((props, ref) => {
  const {
    className,
    classNames,
    contentProps,
    dir,
    enableIndicator = true,
    forceMountContent,
    items,
    listProps,
    loop,
    orientation = 'horizontal',
    renderContent,
    renderTrigger,
    shape = 'square',
    size,
    triggerProps,
    type,
    value,
    ...rest
  } = props;

  return (
    <Root
      className={[className, classNames?.root]}
      dir={dir}
      orientation={orientation}
      ref={ref}
      size={size}
      value={value}
      {...rest}
    >
      <TabsList
        className={classNames?.list}
        dir={dir}
        enableIndicator={enableIndicator}
        loop={loop}
        orientation={orientation}
        shape={shape}
        size={size}
        type={type}
        value={value}
        classNames={{
          indicator: classNames?.indicator,
          indicatorRoot: classNames?.indicatorRoot
        }}
        {...listProps}
      >
        {items.map(item => (
          <TabsTrigger
            className={classNames?.trigger}
            dir={dir}
            disabled={item.disabled}
            enableIndicator={enableIndicator}
            key={item.value}
            size={size}
            type={type}
            value={item.value}
            {...triggerProps}
          >
            {renderTrigger ? renderTrigger({ active: item.value === value, item }) : item.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {items.map(item => (
        <TabsContent
          className={classNames?.content}
          dir={dir}
          forceMount={forceMountContent}
          key={item.value}
          orientation={orientation}
          size={size}
          value={item.value}
          {...contentProps}
        >
          {renderContent ? renderContent({ active: item.value === value, item }) : item.children}
        </TabsContent>
      ))}
    </Root>
  );
});

TabsUI.displayName = 'TabsUI';

export default TabsUI;
