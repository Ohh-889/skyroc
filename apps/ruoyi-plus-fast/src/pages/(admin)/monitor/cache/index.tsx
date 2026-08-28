import { SvgIcon } from '@shell/ui/compose';
import { createFileRoute } from '@tanstack/react-router';
import { Alert, Button, Card, Descriptions, Flex, Space, Spin, Switch, Typography } from 'antd';
import type { DescriptionsProps } from 'antd';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';
import { useEffect, useRef, useState } from 'react';

import { useCacheInfoQuery } from '@/service/api/monitor-cache';

interface CacheChartProps {
  /** ECharts 图表配置。 */
  option: EChartsOption;
}

const CacheChart = (props: CacheChartProps) => {
  const { option } = props;
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
    <div
      ref={chartRef}
      className="h-360px w-full"
    />
  );
};

function formatCpu(value: string | undefined) {
  const parsed = Number.parseFloat(value ?? '0');
  return Number.isFinite(parsed) ? parsed.toFixed(2) : '-';
}

interface CacheManagementProps {
  /** 是否在页面进入时启用自动刷新。 */
  initialAutoRefresh?: boolean;
}

const CacheManagement = (props: CacheManagementProps) => {
  const { initialAutoRefresh = false } = props;
  const [autoRefresh, setAutoRefresh] = useState(initialAutoRefresh);
  const cacheQuery = useCacheInfoQuery();
  const cache = cacheQuery.data;

  useEffect(() => {
    if (!autoRefresh) return;
    const timer = window.setInterval(() => cacheQuery.refetch(), 30_000);
    return () => window.clearInterval(timer);
  }, [autoRefresh, cacheQuery.refetch]);

  function getInfo(key: string) {
    return cache?.info[key] ?? '-';
  }

  const commandOption: EChartsOption = {
    legend: { bottom: 0, left: 'center', type: 'scroll' },
    series: [
      {
        center: ['50%', '42%'],
        data: (cache?.commandStats ?? []).map(item => ({ name: item.name, value: Number(item.value) })),
        name: '命令',
        radius: [24, 112],
        roseType: 'radius',
        type: 'pie'
      }
    ],
    tooltip: { formatter: '{a} <br/>{b}: {c} ({d}%)', trigger: 'item' }
  };
  const memoryValue = Number.parseFloat(getInfo('used_memory_human')) || 0;
  const memoryOption: EChartsOption = {
    series: [
      {
        axisLabel: { distance: 14 },
        detail: { formatter: getInfo('used_memory_human'), offsetCenter: [0, '70%'], valueAnimation: true },
        data: [{ name: '内存使用量', value: memoryValue }],
        max: Math.max(100, memoryValue * 2),
        name: '内存使用量',
        progress: { show: true, width: 12 },
        type: 'gauge'
      }
    ],
    tooltip: { formatter: `{b}<br/>{a}: ${getInfo('used_memory_human')}` }
  };
  const descriptionItems: DescriptionsProps['items'] = [
    { children: getInfo('redis_version'), key: 'redis_version', label: 'Redis 版本' },
    {
      children: getInfo('redis_mode') === 'standalone' ? '单机' : getInfo('redis_mode'),
      key: 'redis_mode',
      label: '运行模式'
    },
    { children: getInfo('tcp_port'), key: 'tcp_port', label: '端口' },
    { children: getInfo('connected_clients'), key: 'connected_clients', label: '客户端数' },
    { children: getInfo('uptime_in_days'), key: 'uptime_in_days', label: '运行时间(天)' },
    { children: getInfo('used_memory_human'), key: 'used_memory_human', label: '使用内存' },
    { children: formatCpu(getInfo('used_cpu_user_children')), key: 'used_cpu_user_children', label: '使用 CPU' },
    { children: getInfo('maxmemory_human'), key: 'maxmemory_human', label: '内存配置' },
    { children: getInfo('aof_enabled') === '0' ? '否' : '是', key: 'aof_enabled', label: 'AOF 开启' },
    { children: getInfo('rdb_last_bgsave_status'), key: 'rdb_last_bgsave_status', label: 'RDB 状态' },
    { children: cache?.dbSize ?? '-', key: 'db_size', label: 'Key 数量' },
    {
      children: `${getInfo('instantaneous_input_kbps')}kps / ${getInfo('instantaneous_output_kbps')}kps`,
      key: 'network_throughput',
      label: '网络入口/出口'
    }
  ];

  return (
    <div className="h-full min-w-0 overflow-x-hidden overflow-y-auto">
      <Space
        className="min-w-0 w-full"
        orientation="vertical"
        size={16}
      >
        <Card
          className="card-wrapper"
          variant="borderless"
        >
          <Flex
            align="center"
            justify="space-between"
            wrap="wrap"
            gap={12}
          >
            <Flex
              align="center"
              gap={8}
            >
              <SvgIcon icon="ph:database" />
              <Typography.Title
                level={4}
                className="m-0"
              >
                Redis 缓存监控
              </Typography.Title>
            </Flex>
            <Flex
              align="center"
              gap={12}
            >
              <Typography.Text type="secondary">自动刷新</Typography.Text>
              <Switch
                checked={autoRefresh}
                onChange={setAutoRefresh}
              />
              <Button
                icon={<SvgIcon icon="ic:round-refresh" />}
                loading={cacheQuery.isFetching}
                onClick={() => cacheQuery.refetch()}
              >
                刷新数据
              </Button>
            </Flex>
          </Flex>
        </Card>

        {cacheQuery.isError ? (
          <Alert
            showIcon
            type="error"
            title="缓存监控加载失败"
            action={<Button onClick={() => cacheQuery.refetch()}>重试</Button>}
          />
        ) : null}
        <Card
          className="card-wrapper"
          title={
            <Flex
              align="center"
              gap={8}
            >
              <SvgIcon icon="ph:monitor" />
              Redis 基本信息
            </Flex>
          }
          variant="borderless"
        >
          {cacheQuery.isPending && !cache ? (
            <div className="h-120px grid place-items-center">
              <Spin />
            </div>
          ) : (
            <Descriptions
              bordered
              column={{ xs: 1, sm: 2, md: 4 }}
              items={descriptionItems}
              size="small"
            />
          )}
        </Card>
        <div className="min-w-0 grid grid-cols-1 gap-16px lg:grid-cols-2">
          <div className="min-w-0">
            <Card
              className="h-full min-w-0 card-wrapper"
              title={
                <Flex
                  align="center"
                  gap={8}
                >
                  <SvgIcon icon="ph:chart-pie-slice" />
                  命令统计
                </Flex>
              }
              variant="borderless"
            >
              <CacheChart option={commandOption} />
            </Card>
          </div>
          <div className="min-w-0">
            <Card
              className="h-full min-w-0 card-wrapper"
              title={
                <Flex
                  align="center"
                  gap={8}
                >
                  <SvgIcon icon="ph:gauge" />
                  内存信息
                </Flex>
              }
              variant="borderless"
            >
              <CacheChart option={memoryOption} />
            </Card>
          </div>
        </div>
      </Space>
    </div>
  );
};

export const Route = createFileRoute('/(admin)/monitor/cache/')({
  component: CacheManagement,
  staticData: { menu: { icon: 'ph:database', order: 2 }, title: '缓存监控' }
});
