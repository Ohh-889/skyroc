import { Button, Checkbox, Drawer, Empty, Flex, Input, Spin } from 'antd';
import { useEffect, useMemo, useState } from 'react';

import { useUserAuthRoleQuery } from '@/service/api/system-user';
import type { UserId } from '@/service/api/system-user';

interface UserRoleDrawerProps {
  /** 保存请求是否执行中。 */
  loading: boolean;
  /** 关闭角色抽屉。 */
  onClose: () => void;
  /** 保存用户角色。 */
  onSubmit: (roleIds: UserId[]) => Promise<void>;
  /** 抽屉是否打开。 */
  open: boolean;
  /** 授权中的用户 ID。 */
  userId: UserId;
}

const UserRoleDrawer = (props: UserRoleDrawerProps) => {
  const { loading, onClose, onSubmit, open, userId } = props;

  const query = useUserAuthRoleQuery(userId, open);
  const [keyword, setKeyword] = useState('');
  const [selectedRoleIds, setSelectedRoleIds] = useState<UserId[]>([]);
  const roles = useMemo(() => {
    const normalized = keyword.trim().toLocaleLowerCase();
    return (query.data?.roles ?? []).filter(
      role =>
        !normalized ||
        role.roleName.toLocaleLowerCase().includes(normalized) ||
        role.roleKey.toLocaleLowerCase().includes(normalized)
    );
  }, [keyword, query.data?.roles]);

  useEffect(() => {
    if (!query.data) return;
    setSelectedRoleIds(query.data.roles.filter(role => role.flag).map(role => role.roleId));
  }, [query.data]);

  return (
    <Drawer
      footer={
        <Flex gap={8} justify="flex-end">
          <Button onClick={onClose}>取消</Button>
          <Button loading={loading} type="primary" onClick={() => onSubmit(selectedRoleIds)}>
            保存角色
          </Button>
        </Flex>
      }
      open={open}
      title={`分配角色${query.data?.user ? ` · ${query.data.user.nickName}` : ''}`}
      size={520}
      onClose={onClose}
    >
      <Input
        allowClear
        className="mb-14px"
        placeholder="搜索角色名称或编码"
        value={keyword}
        onChange={event => setKeyword(event.target.value)}
      />
      <Spin spinning={query.isLoading}>
        {roles.length ? (
          roles.map(role => (
            <label
              className="mb-8px flex cursor-pointer items-start gap-10px rounded-8px border border-border-2 p-12px"
              key={String(role.roleId)}
            >
              <Checkbox
                checked={selectedRoleIds.map(String).includes(String(role.roleId))}
                disabled={role.superAdmin}
                onChange={event =>
                  setSelectedRoleIds(current =>
                    event.target.checked
                      ? [...current, role.roleId]
                      : current.filter(id => String(id) !== String(role.roleId))
                  )
                }
              />
              <span>
                <strong className="block">{role.roleName}</strong>
                <span className="text-12px text-tertiary">{role.roleKey}</span>
              </span>
            </label>
          ))
        ) : (
          <Empty description="暂无可分配角色" />
        )}
      </Spin>
    </Drawer>
  );
};

export default UserRoleDrawer;
