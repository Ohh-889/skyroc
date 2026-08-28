import { Card, ScrollArea } from '@skyroc/web-ui';
import React from 'react';
import COMPONENT_DIRS from '../../../../component-list.json';
import { Link } from '../../../i18n/navigation';
import DemoTabs from './modules/DemoTabs';
import DemoTitle from './modules/DemoTitle';

function getComponentDirectories() {
  try {
    const componentDirs = COMPONENT_DIRS.map(dir => ({
      children: null,
      label: <Link href={`/${dir.name}`}>{dir.name.charAt(0).toUpperCase() + dir.name.slice(1)}</Link>,
      value: dir.name
    }));

    return componentDirs;
  } catch (error) {
    console.error('failed to read the component directory:', error);

    return [{ children: null, label: 'Button', value: 'button' }];
  }
}

const DemoLayout = ({ children }: { children: React.ReactNode }) => {
  const componentTabs = getComponentDirectories();

  return (
    <div className="flex h-full grow flex-col">
      <DemoTabs items={componentTabs} />

      <ScrollArea
        orientation="vertical"
        size="sm"
      >
        <Card
          className="flex-1"
          classNames={{ content: 'flex-c gap-3 flex-1' }}
          title={<DemoTitle />}
        >
          {children}
        </Card>
      </ScrollArea>
    </div>
  );
};

export default DemoLayout;
