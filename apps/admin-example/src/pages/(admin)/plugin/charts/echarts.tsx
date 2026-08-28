import { createFileRoute } from '@tanstack/react-router';
import { Space } from 'antd';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';
import { useEffect, useRef } from 'react';

import {
  barOption,
  createGaugeUpdateOption,
  gaugeOption,
  lineOption,
  pieOption,
  radarOption
} from '../modules/chart-options';
import { ExamplePanel, PluginPageHeader } from '../modules/shared';

interface ChartPreviewProps {
  /** 图表容器高度。 */
  height?: number;

  /** ECharts setOption 所需配置。 */
  option: EChartsOption;

  /** 图表标题，用于区分 ECharts 示例。 */
  title: string;
}

const ChartPreview = (props: ChartPreviewProps) => {
  const { height = 360, option, title } = props;

  const chartRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current);
    chart.setOption(option);

    function resizeChart() {
      chart.resize();
    }

    window.addEventListener('resize', resizeChart);

    return () => {
      window.removeEventListener('resize', resizeChart);
      chart.dispose();
    };
  }, [option]);

  return (
    <ExamplePanel
      icon="mdi:chart-box-outline"
      title={title}
    >
      <div
        ref={chartRef}
        style={{ height }}
      />
    </ExamplePanel>
  );
};

const GaugeClock = () => {
  const chartRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current);
    chart.setOption(gaugeOption);

    function updateGauge() {
      const date = new Date();
      const second = date.getSeconds();
      const minute = date.getMinutes() + second / 60;
      const hour = (date.getHours() % 12) + minute / 60;

      chart.setOption(createGaugeUpdateOption(hour, minute, second));
    }

    function resizeChart() {
      chart.resize();
    }

    updateGauge();
    const intervalId = window.setInterval(updateGauge, 1000);
    window.addEventListener('resize', resizeChart);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener('resize', resizeChart);
      chart.dispose();
    };
  }, []);

  return (
    <ExamplePanel
      icon="mdi:gauge"
      title="仪表盘时钟"
    >
      <div
        ref={chartRef}
        style={{ height: 640 }}
      />
    </ExamplePanel>
  );
};

const EchartsDemo = () => {
  return (
    <Space
      className="w-full"
      orientation="vertical"
      size={16}
    >
      <PluginPageHeader
        icon="simple-icons:apacheecharts"
        resources={[{ label: 'ECharts', url: 'https://echarts.apache.org/' }]}
        tags={['echarts', 'Canvas', 'Resize Binding']}
        title="ECharts 示例"
      />
      <ChartPreview
        option={pieOption}
        title="南丁格尔玫瑰图"
      />
      <ChartPreview
        option={lineOption}
        title="堆叠折线图"
      />
      <ChartPreview
        option={barOption}
        title="柱状图"
      />
      <ChartPreview
        option={radarOption}
        title="雷达图"
      />
      <GaugeClock />
    </Space>
  );
};

export const Route = createFileRoute('/(admin)/plugin/charts/echarts')({
  component: EchartsDemo,
  staticData: {
    i18nKey: 'route.plugin_charts_echarts',
    menu: {
      icon: 'simple-icons:apacheecharts',
      order: 10
    },
    title: 'plugin_charts_echarts'
  }
});
