import { SvgIcon } from '@skyroc/web-ui-compose';
import { useQueryClient } from '@tanstack/react-query';
import {
  Avatar,
  Badge,
  Button,
  Checkbox,
  Drawer,
  Empty,
  Flex,
  Input,
  Pagination,
  Popconfirm,
  Spin,
  Tabs,
  Tag,
  Typography
} from 'antd';
import { useState } from 'react';
import type { Key } from 'react';

import {
  SYSTEM_ROLE_QUERY_KEYS,
  useAllocatedRoleMembersQuery,
  useAssignRoleMembersMutation,
  useCancelRoleMemberMutation,
  useUnallocatedRoleMembersQuery
} from '@/service/api/system-role';
import type { RoleItem, RoleMember, RoleMemberListParams } from '@/service/api/system-role';

interface RoleMemberDrawerProps {
  /** 关闭角色成员抽屉。 */
  onClose: () => void;

  /** 角色成员抽屉是否打开。 */
  open: boolean;

  /** 当前管理成员的角色。 */
  role?: RoleItem;
}

type MemberTab = 'allocated' | 'available';

function maskPhone(phone: string) {
  if (phone.length < 7) return phone;
  return `${phone.slice(0, 3)}****${phone.slice(-4)}`;
}

const RoleMemberDrawer = (props: RoleMemberDrawerProps) => {
  const { onClose, open, role } = props;

  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<MemberTab>('allocated');
  const [current, setCurrent] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [submittedKeyword, setSubmittedKeyword] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState<Key[]>([]);
  const memberParams: RoleMemberListParams = {
    current,
    roleId: role?.roleId ?? '0',
    size: 8,
    userName: submittedKeyword || undefined
  };
  const allocatedQuery = useAllocatedRoleMembersQuery(memberParams, open && Boolean(role) && activeTab === 'allocated');
  const availableQuery = useUnallocatedRoleMembersQuery(
    memberParams,
    open && Boolean(role) && activeTab === 'available'
  );
  const cancelMutation = useCancelRoleMemberMutation();
  const assignMutation = useAssignRoleMembersMutation();
  const activeQuery = activeTab === 'allocated' ? allocatedQuery : availableQuery;
  const members = activeQuery.data?.records ?? [];

  function handleTabChange(key: string) {
    setActiveTab(key as MemberTab);
    setCurrent(1);
    setSelectedUserIds([]);
  }

  function handleSearch() {
    setCurrent(1);
    setSubmittedKeyword(keyword.trim());
  }

  async function invalidateMembers() {
    await queryClient.invalidateQueries({ queryKey: SYSTEM_ROLE_QUERY_KEYS.ALL });
  }

  async function handleCancelMember(member: RoleMember) {
    if (!role) return;
    await cancelMutation.mutateAsync({ roleId: role.roleId, userId: member.userId });
    await invalidateMembers();
  }

  async function handleAssignMembers() {
    if (!role || selectedUserIds.length === 0) return;
    await assignMutation.mutateAsync({ roleId: role.roleId, userIds: selectedUserIds.map(String) });
    setSelectedUserIds([]);
    await invalidateMembers();
  }

  function renderMember(member: RoleMember) {
    const selected = selectedUserIds.map(String).includes(String(member.userId));
    return (
      <div
        className="flex items-center gap-12px border-b border-border-secondary px-4px py-12px last:border-b-0"
        key={String(member.userId)}
      >
        {activeTab === 'available' ? (
          <Checkbox
            checked={selected}
            onChange={event => {
              setSelectedUserIds(currentKeys =>
                event.target.checked
                  ? [...currentKeys, String(member.userId)]
                  : currentKeys.filter(key => String(key) !== String(member.userId))
              );
            }}
          />
        ) : null}
        <Avatar className="shrink-0 bg-primary-2 text-primary">
          {(member.nickName || member.userName).slice(0, 1)}
        </Avatar>
        <div className="min-w-0 flex-1">
          <Flex align="center" gap={7} wrap>
            <Typography.Text strong>{member.nickName || member.userName}</Typography.Text>
            <Tag className="m-0 font-mono text-11px" variant="filled">
              {member.userName}
            </Tag>
            <Badge
              status={member.status === '0' ? 'success' : 'default'}
              text={member.status === '0' ? '正常' : '停用'}
            />
          </Flex>
          <Typography.Text className="mt-3px block truncate text-12px" type="secondary">
            {member.deptName || '未分配部门'} · {maskPhone(member.phonenumber) || '未填写手机号'}
          </Typography.Text>
        </div>
        {activeTab === 'allocated' ? (
          <Popconfirm
            description="移除后，该用户将失去此角色授予的权限。"
            okButtonProps={{ danger: true, loading: cancelMutation.isPending }}
            okText="确认移除"
            title="移除角色成员？"
            onConfirm={() => handleCancelMember(member)}
          >
            <Button danger size="small">
              移除
            </Button>
          </Popconfirm>
        ) : null}
      </div>
    );
  }

  return (
    <Drawer
      destroyOnHidden
      extra={
        activeTab === 'available' ? (
          <Button
            disabled={selectedUserIds.length === 0}
            loading={assignMutation.isPending}
            type="primary"
            onClick={handleAssignMembers}
          >
            添加所选成员
          </Button>
        ) : null
      }
      open={open}
      title={
        <div>
          <div className="text-17px font-600">角色成员</div>
          <div className="mt-3px text-12px text-tertiary">{role ? `${role.roleName} · ${role.roleKey}` : ''}</div>
        </div>
      }
      size={620}
      onClose={onClose}
    >
      <div className="mb-14px rounded-10px bg-layout p-14px">
        <Flex align="center" gap={12}>
          <span className="size-38px grid shrink-0 place-items-center rounded-9px bg-primary-1 text-primary">
            <SvgIcon className="text-20px" icon="ph:users-three" />
          </span>
          <div>
            <Typography.Text className="block" strong>
              {role?.roleName}
            </Typography.Text>
            <Typography.Text className="text-12px" type="secondary">
              查看已分配成员，或从当前租户用户中继续添加。
            </Typography.Text>
          </div>
        </Flex>
      </div>
      <Tabs
        activeKey={activeTab}
        items={[
          { key: 'allocated', label: '已分配成员' },
          { key: 'available', label: '添加成员' }
        ]}
        onChange={handleTabChange}
      />
      <Flex className="mb-12px" gap={8}>
        <Input
          allowClear
          placeholder="搜索用户名或姓名"
          prefix={<SvgIcon className="text-tertiary" icon="ph:magnifying-glass" />}
          value={keyword}
          onChange={event => setKeyword(event.target.value)}
          onPressEnter={handleSearch}
        />
        <Button type="primary" onClick={handleSearch}>
          查询
        </Button>
      </Flex>
      <Spin spinning={activeQuery.isLoading || activeQuery.isFetching}>
        <div className="min-h-360px">
          {members.length ? (
            members.map(renderMember)
          ) : (
            <Empty description={activeTab === 'allocated' ? '暂无已分配成员' : '暂无可添加成员'} />
          )}
        </div>
      </Spin>
      <Flex className="mt-14px" justify="flex-end">
        <Pagination
          current={current}
          pageSize={8}
          showSizeChanger={false}
          total={activeQuery.data?.total ?? 0}
          onChange={setCurrent}
        />
      </Flex>
    </Drawer>
  );
};

export default RoleMemberDrawer;
