import { Alert, Badge, Button, Card, Descriptions, Drawer, Flex, Spin, Typography } from 'antd';

import { useTenantPackageDetailQuery } from '@/service/api/system-tenant-package';
import type { TenantPackageId } from '@/service/api/system-tenant-package';

import { formatTenantMinute } from '../../modules/tenant-utils';

import { formatPackageMenuScope, formatTenantPackageStatus } from './tenant-package-utils';

interface TenantPackageDetailDrawerProps {
  /** 关闭详情抽屉。 */
  onClose: () => void;
  /** 转到编辑当前套餐。 */
  onEdit: () => void;
  /** 抽屉是否打开。 */
  open: boolean;
  /** 当前查看的套餐主键。 */
  packageId?: TenantPackageId;
}

const TenantPackageDetailDrawer = (props: TenantPackageDetailDrawerProps) => {
  const { onClose, onEdit, open, packageId } = props;

  const detailQuery = useTenantPackageDetailQuery(packageId, open);
  const tenantPackage = detailQuery.data;

  return (
    <Drawer
      destroyOnHidden
      open={open}
      title="套餐详情"
      width={560}
      footer={
        <Flex
          gap={8}
          justify="flex-end"
        >
          <Button onClick={onClose}>关闭</Button>
          <Button
            disabled={!tenantPackage}
            type="primary"
            onClick={onEdit}
          >
            编辑套餐
          </Button>
        </Flex>
      }
      onClose={onClose}
    >
      {detailQuery.isError ? (
        <Alert
          className="mb-16px"
          showIcon
          title="套餐详情加载失败"
          type="error"
          action={
            <Button
              size="small"
              onClick={() => detailQuery.refetch()}
            >
              重试
            </Button>
          }
        />
      ) : null}

      <Spin spinning={detailQuery.isLoading}>
        {tenantPackage ? (
          <div className="flex flex-col gap-16px">
            <Flex
              align="center"
              gap={12}
            >
              <div className="min-w-0 flex-1">
                <Typography.Title
                  className="mb-2px!"
                  level={4}
                >
                  {tenantPackage.packageName || '未命名套餐'}
                </Typography.Title>
                <Typography.Text
                  className="font-mono"
                  type="secondary"
                >
                  套餐 #{tenantPackage.packageId}
                </Typography.Text>
              </div>
              <Badge
                status={tenantPackage.status === '0' ? 'success' : 'error'}
                text={formatTenantPackageStatus(tenantPackage.status)}
              />
            </Flex>

            <Card
              size="small"
              title="授权范围"
            >
              <Descriptions
                column={1}
                size="small"
                items={[
                  {
                    children: formatPackageMenuScope(tenantPackage.menuIds),
                    key: 'menuIds',
                    label: '菜单范围'
                  },
                  {
                    children: tenantPackage.menuCheckStrictly ? '父子联动' : '独立选择',
                    key: 'menuCheckStrictly',
                    label: '选择方式'
                  },
                  {
                    children: formatTenantMinute(tenantPackage.createTime) || '—',
                    key: 'createTime',
                    label: '创建时间'
                  },
                  {
                    children: tenantPackage.remark?.trim() || '—',
                    key: 'remark',
                    label: '备注'
                  }
                ]}
              />
            </Card>

            <Alert
              showIcon
              type="info"
              description="套餐只是授权模板。改动它不会自动作用到已经使用它的租户，需要在租户管理页对每一家租户执行一次“同步套餐”。"
              title="套餐与存量租户是两件事"
            />
          </div>
        ) : null}
      </Spin>
    </Drawer>
  );
};

export default TenantPackageDetailDrawer;
