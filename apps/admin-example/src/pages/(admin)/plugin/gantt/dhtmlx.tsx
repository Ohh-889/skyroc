// oxlint-disable import/no-unassigned-import
import { createFileRoute } from '@tanstack/react-router';
import { Space } from 'antd';
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';
import { gantt } from 'dhtmlx-gantt';
import { useEffect, useRef } from 'react';

import { ganttData } from '../modules/plugin-data';
import { ExamplePanel, PluginPageHeader } from '../modules/shared';

const DhtmlxGanttDemo = () => {
  const ganttRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ganttRef.current) return;

    gantt.config.date_format = '%Y-%m-%d';
    gantt.config.row_height = 36;
    gantt.config.scale_height = 54;
    gantt.config.readonly = false;
    gantt.init(ganttRef.current);
    gantt.parse(ganttData);

    return () => {
      gantt.clearAll();
    };
  }, []);

  return (
    <Space
      className="w-full"
      orientation="vertical"
      size={16}
    >
      <PluginPageHeader
        icon="mdi:timeline-clock-outline"
        resources={[{ label: 'dhtmlxGantt', url: 'https://docs.dhtmlx.com/gantt/' }]}
        tags={['dhtmlx-gantt', 'Project Schedule']}
        title="甘特图示例"
      />
      <ExamplePanel
        icon="mdi:timeline-clock-outline"
        title="dhtmlxGantt"
      >
        <div
          className="h-560px overflow-hidden rounded-lg border border-border"
          ref={ganttRef}
        />
      </ExamplePanel>
    </Space>
  );
};

export const Route = createFileRoute('/(admin)/plugin/gantt/dhtmlx')({
  component: DhtmlxGanttDemo,
  staticData: {
    i18nKey: 'route.plugin_gantt_dhtmlx',
    menu: {
      icon: 'mdi:timeline-clock-outline',
      order: 10
    },
    title: 'plugin_gantt_dhtmlx'
  }
});
