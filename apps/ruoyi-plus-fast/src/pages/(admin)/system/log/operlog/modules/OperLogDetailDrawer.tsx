import { Alert, Badge, Button, Descriptions, Drawer, Flex, Typography } from 'antd';
import type { DescriptionsProps } from 'antd';

import type { OperLogItem } from '@/service/api/monitor-operlog';

interface OperLogDetailDrawerProps {
  /** 关闭操作日志详情抽屉。 */
  onClose: () => void;
  /** 当前详情抽屉是否打开。 */
  open: boolean;
  /** 当前查看的日志记录。 */
  record?: OperLogItem;
}

const OperLogDetailDrawer = (props: OperLogDetailDrawerProps) => {
  const { onClose, open, record } = props;

  const items: DescriptionsProps['items'] = record
    ? [
        { children: String(record.operId), key: 'operId', label: '日志编号' },
        {
          children: <Badge status={record.status === 0 ? 'success' : 'error'} text={getStatusLabel(record.status)} />,
          key: 'status',
          label: '操作状态'
        },
        { children: `${record.title} / ${getBusinessTypeLabel(record.businessType)}`, key: 'module', label: '系统模块' },
        {
          children: `${record.operName} / ${record.deptName || '—'} / ${record.operIp} / ${record.operLocation || '—'}`,
          key: 'operator',
          label: '操作信息'
        },
        { children: `${record.requestMethod} ${record.operUrl}`, key: 'request', label: '请求信息' },
        { children: record.method || '—', key: 'method', label: '操作方法' },
        { children: record.operTime || '—', key: 'time', label: '操作时间' },
        { children: renderJson(record.operParam), key: 'params', label: '请求参数', span: 2 },
        { children: renderJson(record.jsonResult), key: 'result', label: '返回参数', span: 2 },
        { children: `${record.costTime} ms`, key: 'cost', label: '消耗时间' },
        {
          children: record.errorMsg ? <Typography.Text type="danger">{record.errorMsg}</Typography.Text> : '—',
          key: 'error',
          label: '错误消息',
          span: 2
        }
      ]
    : [];

  return (
    <Drawer
      destroyOnHidden
      footer={
        <Flex justify="flex-end">
          <Button onClick={onClose}>关闭</Button>
        </Flex>
      }
      open={open}
      size={680}
      title="操作日志详情"
      onClose={onClose}
    >
      {record ? <Descriptions bordered column={1} items={items} size="small" /> : <Alert description="未选择日志记录" type="info" />}
    </Drawer>
  );
};

function renderJson(value: string) {
  if (!value) return <Typography.Text type="secondary">—</Typography.Text>;

  try {
    const parsed = JSON.parse(value) as unknown;
    return (
      <pre className="m-0 max-h-280px overflow-auto whitespace-pre-wrap break-all rounded-6px bg-fill-2 p-10px text-12px">
        {JSON.stringify(parsed, null, 2)}
      </pre>
    );
  } catch {
    return <Typography.Text className="whitespace-pre-wrap break-all">{value}</Typography.Text>;
  }
}

function getBusinessTypeLabel(value: OperLogItem['businessType']) {
  return ['其它', '新增', '修改', '删除', '授权', '导出', '导入', '强退', '生成代码', '清空数据'][value] ?? '未知';
}

function getStatusLabel(value: OperLogItem['status']) {
  return value === 0 ? '正常' : '异常';
}

export default OperLogDetailDrawer;
