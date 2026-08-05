import { SvgIcon } from '@skyroc/web-ui-compose';
import { Badge, Button, Card, Descriptions, Empty, Flex, Tag } from 'antd';
import type { DescriptionsProps } from 'antd';

import type { MenuItem } from '@/service/api/system-menu';

import { getMenuTypeIcon, getMenuTypeLabel } from './menu-utils';

type DescriptionItem = NonNullable<DescriptionsProps['items']>[number];

interface MenuDetailCardProps {
  /** 当前菜单的直属路由子节点数量。 */
  childCount: number;
  /** 当前选中的菜单资源。 */
  menu?: MenuItem;
  /** 当前菜单在资源树中的完整路径。 */
  menuPath: string;
  /** 删除当前菜单操作。 */
  onDelete: () => void;
  /** 编辑当前菜单操作。 */
  onEdit: () => void;
}

const MenuDetailCard = (props: MenuDetailCardProps) => {
  const { childCount, menu, menuPath, onDelete, onEdit } = props;

  if (!menu) {
    return (
      <Card className="card-wrapper" title="菜单详情" variant="borderless">
        <Empty description="请从左侧选择目录或菜单" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      </Card>
    );
  }

  const descriptionItems = createDescriptionItems(menu);

  return (
    <Card
      className="card-wrapper"
      extra={
        <Flex gap={8}>
          <Button icon={<SvgIcon icon="ph:pencil-simple" />} size="small" onClick={onEdit}>
            编辑
          </Button>
          <Button danger icon={<SvgIcon icon="ph:trash" />} size="small" onClick={onDelete}>
            删除
          </Button>
        </Flex>
      }
      title={
        <div>
          <div>菜单详情</div>
          <div className="mt-2px text-11px text-tertiary font-normal">{menuPath}</div>
        </div>
      }
      variant="borderless"
    >
      <div className="mb-14px flex items-center gap-12px rounded-10px bg-layout p-12px">
        <div
          className={
            menu.menuType === 'M'
              ? 'size-48px flex-center shrink-0 rounded-12px bg-primary-bg text-24px text-primary'
              : 'size-48px flex-center shrink-0 rounded-12px bg-info-bg text-24px text-info'
          }
        >
          <SvgIcon icon={getMenuTypeIcon(menu.menuType)} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-17px font-650 text-base">{menu.menuName}</div>
          <div className="mt-3px truncate text-12px text-tertiary">
            {menu.menuType === 'M'
              ? `包含 ${childCount} 个直属路由节点`
              : `页面路由 · ${menu.component || '未配置组件路径'}`}
          </div>
        </div>
        <Tag color={menu.menuType === 'M' ? 'geekblue' : 'blue'}>{getMenuTypeLabel(menu.menuType)}</Tag>
      </div>

      <Descriptions bordered column={{ lg: 4, md: 2, sm: 2, xs: 1 }} items={descriptionItems} size="small" />
    </Card>
  );
};

function createDescriptionItems(menu: MenuItem): DescriptionItem[] {
  return [
    {
      children: renderStatus(menu.status),
      key: 'status',
      label: '菜单状态'
    },
    {
      children: menu.visible === '0' ? '显示' : '隐藏',
      key: 'visible',
      label: '显示状态'
    },
    {
      children: menu.orderNum,
      key: 'orderNum',
      label: '显示排序'
    },
    {
      children: menu.isFrame === '0' ? '是' : '否',
      key: 'isFrame',
      label: '是否外链'
    },
    {
      children: renderCode(menu.path),
      key: 'path',
      label: '路由地址'
    },
    {
      children: renderCode(menu.component),
      key: 'component',
      label: '组件路径'
    },
    {
      children: renderCode(menu.perms),
      key: 'perms',
      label: '权限字符'
    },
    {
      children: getCacheLabel(menu),
      key: 'isCache',
      label: '是否缓存'
    }
  ];
}

function getCacheLabel(menu: MenuItem) {
  if (menu.menuType !== 'C') return '—';
  return menu.isCache === '0' ? '缓存' : '不缓存';
}

function renderStatus(status: MenuItem['status']) {
  return <Badge status={status === '0' ? 'success' : 'warning'} text={status === '0' ? '正常' : '停用'} />;
}

function renderCode(value: string | null) {
  if (!value) return <span className="text-tertiary">—</span>;
  return <code className="text-12px">{value}</code>;
}

export default MenuDetailCard;
