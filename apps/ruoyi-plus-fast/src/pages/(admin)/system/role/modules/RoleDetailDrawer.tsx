import { SvgIcon } from '@shell/ui/compose';
import { Alert, Badge, Button, Card, Descriptions, Drawer, Flex, Spin, Tag, Typography } from 'antd';

import { useRoleDetailQuery, useRoleMenuTreeQuery } from '@/service/api/system-role';
import type { RoleDataScope, RoleId } from '@/service/api/system-role';

import { buildRoleTreeData, countRoleTreeSelection } from './role-tree';

interface RoleDetailDrawerProps {
  /** 关闭角色详情抽屉。 */
  onClose: () => void;

  /** 从详情进入当前角色编辑。 */
  onEdit: () => void;

  /** 角色详情抽屉是否打开。 */
  open: boolean;

  /** 当前查看的角色 ID。 */
  roleId?: RoleId;
}

const DATA_SCOPE_LABELS: Record<RoleDataScope, string> = {
  '1': '全部数据权限',
  '2': '自定义数据权限',
  '3': '本部门数据权限',
  '4': '本部门及以下数据权限',
  '5': '仅本人数据权限',
  '6': '部门及以下或本人数据权限'
};

function booleanLabel(value: boolean) {
  return value ? '父子联动' : '独立选择';
}

const RoleDetailDrawer = (props: RoleDetailDrawerProps) => {
  const { onClose, onEdit, open, roleId } = props;

  const detailQuery = useRoleDetailQuery(roleId, open);
  const menuTreeQuery = useRoleMenuTreeQuery(roleId, open && Boolean(roleId));
  const role = detailQuery.data;
  const menuTreeData = buildRoleTreeData(menuTreeQuery.data?.menus ?? []);
  const permissionCount = countRoleTreeSelection(menuTreeData, menuTreeQuery.data?.checkedKeys ?? []);
  const loading = detailQuery.isLoading || menuTreeQuery.isLoading;

  return (
    <Drawer
      destroyOnHidden
      footer={
        <Flex
          gap={8}
          justify="flex-end"
        >
          <Button onClick={onClose}>关闭</Button>
          <Button
            disabled={!role || role.superAdmin}
            type="primary"
            onClick={onEdit}
          >
            编辑角色
          </Button>
        </Flex>
      }
      open={open}
      size={620}
      title={
        <div>
          <Flex
            align="center"
            gap={8}
          >
            <span className="text-17px font-600">角色详情</span>
            {role?.superAdmin ? (
              <Tag
                className="m-0"
                color="gold"
                variant="filled"
              >
                系统保护
              </Tag>
            ) : null}
          </Flex>
          <div className="mt-3px text-12px text-tertiary">
            {role ? `${role.roleName} · ${role.roleKey}` : '查看角色基础信息与授权摘要'}
          </div>
        </div>
      }
      onClose={onClose}
    >
      {detailQuery.isError || menuTreeQuery.isError ? (
        <Alert
          action={
            <Button
              size="small"
              onClick={() => Promise.all([detailQuery.refetch(), menuTreeQuery.refetch()])}
            >
              重试
            </Button>
          }
          className="mb-16px"
          showIcon
          title="角色详情加载失败"
          type="error"
        />
      ) : null}
      <Spin spinning={loading}>
        {role ? (
          <div className="grid gap-16px">
            <Card
              size="small"
              title="基本信息"
            >
              <Descriptions
                column={2}
                items={[
                  { children: role.roleName, key: 'roleName', label: '角色名称', span: 2 },
                  {
                    children: <Typography.Text code>{role.roleKey}</Typography.Text>,
                    key: 'roleKey',
                    label: '权限字符',
                    span: 2
                  },
                  { children: String(role.roleId), key: 'roleId', label: '角色 ID' },
                  { children: role.roleSort, key: 'roleSort', label: '显示顺序' },
                  {
                    children: (
                      <Badge
                        status={role.status === '0' ? 'success' : 'warning'}
                        text={role.status === '0' ? '正常' : '停用'}
                      />
                    ),
                    key: 'status',
                    label: '状态'
                  },
                  {
                    children: role.createTime || '—',
                    key: 'createTime',
                    label: '创建时间'
                  },
                  {
                    children: DATA_SCOPE_LABELS[role.dataScope],
                    key: 'dataScope',
                    label: '数据范围',
                    span: 2
                  },
                  {
                    children: booleanLabel(role.menuCheckStrictly),
                    key: 'menuCheckStrictly',
                    label: '菜单选择'
                  },
                  {
                    children: booleanLabel(role.deptCheckStrictly),
                    key: 'deptCheckStrictly',
                    label: '部门选择'
                  }
                ]}
                size="small"
              />
            </Card>

            <div className="grid grid-cols-2 gap-12px">
              <Card size="small">
                <Flex
                  align="center"
                  gap={10}
                >
                  <span className="size-36px grid place-items-center rounded-9px bg-primary-50 text-primary">
                    <SvgIcon
                      className="text-19px"
                      icon="ph:browser"
                    />
                  </span>
                  <div>
                    <Typography.Text
                      className="block text-12px"
                      type="secondary"
                    >
                      已授权菜单
                    </Typography.Text>
                    <Typography.Text
                      className="text-20px"
                      strong
                    >
                      {permissionCount.menus} 项
                    </Typography.Text>
                  </div>
                </Flex>
              </Card>
              <Card size="small">
                <Flex
                  align="center"
                  gap={10}
                >
                  <span className="size-36px grid place-items-center rounded-9px bg-warning-bg text-warning">
                    <SvgIcon
                      className="text-19px"
                      icon="ph:cursor-click"
                    />
                  </span>
                  <div>
                    <Typography.Text
                      className="block text-12px"
                      type="secondary"
                    >
                      已授权按钮
                    </Typography.Text>
                    <Typography.Text
                      className="text-20px"
                      strong
                    >
                      {permissionCount.buttons} 项
                    </Typography.Text>
                  </div>
                </Flex>
              </Card>
            </div>

            <Card
              size="small"
              title="备注"
            >
              <Typography.Paragraph
                className="mb-0!"
                type={role.remark ? undefined : 'secondary'}
              >
                {role.remark || '暂无备注'}
              </Typography.Paragraph>
            </Card>

            {role.superAdmin ? (
              <Alert
                description="该角色由系统保护，只能查看详情，不能通过普通角色管理入口编辑或删除。"
                showIcon
                type="warning"
              />
            ) : null}
          </div>
        ) : null}
      </Spin>
    </Drawer>
  );
};

export default RoleDetailDrawer;
