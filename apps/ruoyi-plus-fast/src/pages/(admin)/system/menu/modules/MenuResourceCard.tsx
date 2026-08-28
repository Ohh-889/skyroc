import { ButtonIcon } from '@shell/ui/antd';
import { SvgIcon, useTableScroll } from '@shell/ui/compose';
import { Badge, Button, Card, Empty, Flex, List, Table, Tag, Typography } from 'antd';
import type { TableColumnsType } from 'antd';

import type { MenuId, MenuItem } from '@/service/api/system-menu';

import { getMenuTypeIcon, getMenuTypeLabel } from './menu-utils';

interface MenuResourceCardProps {
  /** 当前目录下的直属目录或菜单。 */
  children: MenuItem[];
  /** 新增当前资源下级节点。 */
  onAdd: () => void;
  /** 删除按钮权限。 */
  onDeletePermission: (permission: MenuItem) => void;
  /** 编辑按钮权限。 */
  onEditPermission: (permission: MenuItem) => void;
  /** 从直属菜单卡片切换当前菜单。 */
  onSelectChild: (menuId: MenuId) => void;
  /** 当前页面菜单下的按钮权限。 */
  permissions: MenuItem[];
  /** 当前选中的目录或菜单。 */
  selectedMenu?: MenuItem;
}

interface MenuResourceContentProps {
  /** 当前目录下的直属菜单。 */
  childMenus: MenuItem[];
  /** 按钮权限表格列配置。 */
  columns: TableColumnsType<MenuItem>;
  /** 当前选中的是否为页面菜单。 */
  isPageMenu: boolean;
  /** 切换到直属菜单。 */
  onSelectChild: (menuId: MenuId) => void;
  /** 当前页面菜单下的按钮权限。 */
  permissions: MenuItem[];
  /** 按钮权限表格的滚动区域。 */
  scroll: { x: number; y: number | undefined };
  /** 当前选中的目录或菜单。 */
  selectedMenu?: MenuItem;
}

const MenuResourceContent = (props: MenuResourceContentProps) => {
  const { childMenus, columns, isPageMenu, onSelectChild, permissions, scroll, selectedMenu } = props;

  if (!selectedMenu) {
    return (
      <Empty
        description="选择菜单后查看关联资源"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    );
  }

  if (isPageMenu) {
    return (
      <Table<MenuItem>
        column={{ align: 'center' }}
        columns={columns}
        dataSource={permissions}
        locale={{ emptyText: '当前菜单暂无按钮权限' }}
        pagination={false}
        rowKey={record => String(record.menuId)}
        rowSelection={{ align: 'center' }}
        scroll={scroll}
        size="small"
      />
    );
  }

  if (childMenus.length === 0) {
    return (
      <Empty
        description="当前目录暂无直属菜单"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    );
  }

  return (
    <List<MenuItem>
      className="p-14px"
      dataSource={childMenus}
      grid={{ gutter: 10, lg: 3, md: 2, sm: 2, xs: 1 }}
      renderItem={menu => (
        <List.Item>
          <Card
            hoverable
            className="h-full"
            size="small"
            onClick={() => onSelectChild(menu.menuId)}
          >
            <Flex
              align="center"
              gap={10}
            >
              <div className="size-32px flex-center shrink-0 rounded-8px bg-info-bg text-info">
                <SvgIcon icon={getMenuTypeIcon(menu.menuType)} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate font-600 text-base">{menu.menuName}</div>
                <div className="mt-2px truncate text-11px text-tertiary">{menu.path || '未配置路由'}</div>
              </div>
              <Tag
                variant="filled"
                className="m-0 text-10px"
              >
                {getMenuTypeLabel(menu.menuType)}
              </Tag>
            </Flex>
          </Card>
        </List.Item>
      )}
    />
  );
};

const MenuResourceCard = (props: MenuResourceCardProps) => {
  const { children, onAdd, onDeletePermission, onEditPermission, onSelectChild, permissions, selectedMenu } = props;

  const { scrollConfig, tableWrapperRef } = useTableScroll(820);
  const isPageMenu = selectedMenu?.menuType === 'C';
  const resourceSubtitle = getResourceSubtitle(selectedMenu);
  const columns = createPermissionColumns(onDeletePermission, onEditPermission);

  return (
    <div
      className="min-h-320px flex flex-1 flex-col"
      ref={tableWrapperRef}
    >
      <Card
        className="h-full overflow-hidden card-wrapper"
        extra={
          selectedMenu ? (
            <Flex
              align="center"
              gap={10}
            >
              {isPageMenu ? (
                <Typography.Text
                  className="lt-lg:hidden"
                  type="secondary"
                >
                  <span className="mr-6px inline-block size-6px rounded-full bg-primary" />
                  权限变更会影响角色授权
                </Typography.Text>
              ) : null}
              <Button
                icon={<SvgIcon icon="ph:plus" />}
                size="small"
                type="primary"
                ghost
                onClick={onAdd}
              >
                {isPageMenu ? '新增按钮' : '新增菜单'}
              </Button>
            </Flex>
          ) : null
        }
        title={
          <div>
            <div>{isPageMenu ? '按钮权限列表' : '直属菜单'}</div>
            <div className="mt-2px text-11px text-tertiary font-normal">{resourceSubtitle}</div>
          </div>
        }
        variant="borderless"
      >
        <MenuResourceContent
          childMenus={children}
          columns={columns}
          isPageMenu={isPageMenu}
          permissions={permissions}
          scroll={scrollConfig}
          selectedMenu={selectedMenu}
          onSelectChild={onSelectChild}
        />
      </Card>
    </div>
  );
};

function getResourceSubtitle(menu: MenuItem | undefined) {
  if (!menu) return '选择菜单后显示关联资源';
  if (menu.menuType === 'C') {
    return `仅显示“${menu.menuName}”页面下的操作权限`;
  }
  return `显示“${menu.menuName}”目录下的一级节点`;
}

function createPermissionColumns(
  onDelete: (permission: MenuItem) => void,
  onEdit: (permission: MenuItem) => void
): TableColumnsType<MenuItem> {
  return [
    {
      key: 'index',
      render: (_value, _record, index) => index + 1,
      title: '序号',
      width: 70
    },
    {
      dataIndex: 'menuName',
      key: 'menuName',
      align: 'center',
      render: value => (
        <Flex
          align="center"
          gap={8}
          justify="center"
        >
          <div className="size-28px flex-center shrink-0 rounded-7px bg-warning-bg text-warning">
            <SvgIcon icon="ph:key" />
          </div>
          <span className="font-600 text-base">{value}</span>
        </Flex>
      ),
      title: '按钮名称',
      width: 190
    },
    {
      dataIndex: 'perms',
      key: 'perms',
      align: 'center',
      minWidth: 220,
      render: value =>
        value ? (
          <Flex
            align="center"
            gap={4}
            justify="center"
          >
            <code className="truncate text-12px">{value}</code>
            <ButtonIcon
              aria-label="复制权限字符"
              className="h-26px w-26px text-13px"
              icon="ph:copy"
              tooltipContent="复制权限字符"
              onClick={() => copyPermission(value)}
            />
          </Flex>
        ) : (
          <span className="text-tertiary">—</span>
        ),
      title: '权限字符'
    },
    {
      dataIndex: 'status',
      key: 'status',
      render: value => (
        <Badge
          status={value === '0' ? 'success' : 'warning'}
          text={value === '0' ? '正常' : '停用'}
        />
      ),
      title: '状态',
      width: 100
    },
    {
      dataIndex: 'createTime',
      key: 'createTime',
      render: value => value || <span className="text-tertiary">—</span>,
      title: '创建时间',
      width: 170
    },
    {
      fixed: 'right',
      key: 'actions',
      render: (_value, record) => (
        <Flex
          justify="end"
          gap={4}
        >
          <Button
            size="small"
            onClick={() => onEdit(record)}
          >
            编辑
          </Button>
          <Button
            danger
            size="small"
            onClick={() => onDelete(record)}
          >
            删除
          </Button>
        </Flex>
      ),
      title: '操作',
      width: 100
    }
  ];
}

async function copyPermission(value: string) {
  await navigator.clipboard.writeText(value);
  showSuccessMessage('权限字符已复制');
}

export default MenuResourceCard;
