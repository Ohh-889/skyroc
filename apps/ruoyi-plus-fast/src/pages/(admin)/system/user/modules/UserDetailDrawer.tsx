import { Avatar, Button, Descriptions, Drawer, Empty, Flex, Spin, Tag } from 'antd';

import { useUserDetailQuery } from '@/service/api/system-user';
import type { UserId } from '@/service/api/system-user';

interface UserDetailDrawerProps {
  /** 关闭详情抽屉。 */
  onClose: () => void;
  /** 编辑当前用户。 */
  onEdit: () => void;
  /** 抽屉是否打开。 */
  open: boolean;
  /** 查看中的用户 ID。 */
  userId: UserId;
}

const UserDetailDrawer = (props: UserDetailDrawerProps) => {
  const { onClose, onEdit, open, userId } = props;
  const query = useUserDetailQuery(userId, open);
  const user = query.data?.user;

  return (
    <Drawer
      extra={<Button onClick={onEdit}>编辑资料</Button>}
      open={open}
      title="用户详情"
      width={560}
      onClose={onClose}
    >
      <Spin spinning={query.isLoading}>
        {user ? (
          <>
            <Flex align="center" className="mb-20px" gap={12}>
              <Avatar className="bg-primary text-white" size={48}>
                {(user.nickName || user.userName).slice(0, 1)}
              </Avatar>
              <div>
                <div className="text-18px font-600">{user.nickName}</div>
                <div className="text-tertiary">
                  {user.userName} · 用户 ID {user.userId}
                </div>
              </div>
              <Tag className="ml-auto" color={user.status === '0' ? 'success' : 'warning'}>
                {user.status === '0' ? '正常' : '停用'}
              </Tag>
            </Flex>
            <Descriptions
              bordered
              column={1}
              size="small"
              items={[
                { key: 'dept', label: '所属部门', children: user.deptName || '未分配' },
                { key: 'phone', label: '手机号码', children: user.phonenumber || '—' },
                { key: 'email', label: '邮箱', children: user.email || '—' },
                { key: 'login', label: '最后登录', children: user.loginDate || '从未登录' },
                { key: 'ip', label: '最后登录 IP', children: user.loginIp || '—' },
                { key: 'create', label: '创建时间', children: user.createTime },
                { key: 'remark', label: '备注', children: user.remark || '—' }
              ]}
            />
          </>
        ) : (
          <Empty description="暂无用户详情" />
        )}
      </Spin>
    </Drawer>
  );
};

export default UserDetailDrawer;
