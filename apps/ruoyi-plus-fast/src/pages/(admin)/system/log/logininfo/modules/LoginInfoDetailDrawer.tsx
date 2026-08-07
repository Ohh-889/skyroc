import { SvgIcon } from '@skyroc/web-ui-compose';
import { Alert, Badge, Button, Descriptions, Drawer, Flex } from 'antd';
import type { DescriptionsProps } from 'antd';

import type { LoginInfoItem } from '@/service/api/monitor-logininfo';
import { getBrowserIcon, getOsIcon } from '@/utils/icon-tag-format';

interface LoginInfoDetailDrawerProps {
  /** 关闭登录日志详情抽屉。 */
  onClose: () => void;
  /** 当前详情抽屉是否打开。 */
  open: boolean;
  /** 当前查看的登录日志。 */
  record?: LoginInfoItem;
}

const LoginInfoDetailDrawer = (props: LoginInfoDetailDrawerProps) => {
  const { onClose, open, record } = props;
  const items: DescriptionsProps['items'] = record
    ? [
        { children: String(record.infoId), key: 'infoId', label: '访问编号' },
        { children: record.userName, key: 'userName', label: '用户账号' },
        { children: record.clientKey || '—', key: 'clientKey', label: '客户端' },
        { children: getDeviceTypeLabel(record.deviceType), key: 'deviceType', label: '设备类型' },
        {
          children: <Badge status={record.status === '0' ? 'success' : 'error'} text={getStatusLabel(record.status)} />,
          key: 'status',
          label: '登录状态'
        },
        { children: record.ipaddr || '—', key: 'ipaddr', label: '登录 IP' },
        { children: record.loginLocation || '—', key: 'location', label: '登录地点' },
        {
          children: (
            <Flex align="center" gap={8}>
              <SvgIcon icon={getBrowserIcon(record.browser)} />
              {record.browser || '—'}
              <SvgIcon icon={getOsIcon(record.os)} />
              {record.os || '—'}
            </Flex>
          ),
          key: 'environment',
          label: '登录环境'
        },
        { children: record.loginTime || '—', key: 'loginTime', label: '访问时间' },
        { children: record.msg || '—', key: 'msg', label: '提示消息', span: 2 }
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
      size={620}
      title="登录日志详情"
      onClose={onClose}
    >
      {record ? (
        <Descriptions bordered column={1} items={items} size="small" />
      ) : (
        <Alert description="未选择日志记录" type="info" />
      )}
    </Drawer>
  );
};

function getStatusLabel(value: LoginInfoItem['status']) {
  return value === '0' ? '成功' : '失败';
}

function getDeviceTypeLabel(value: string) {
  return ({ pc: '电脑端', mobile: '移动端', miniapp: '小程序' }[value.toLowerCase()] ?? value) || '未知';
}

export default LoginInfoDetailDrawer;
