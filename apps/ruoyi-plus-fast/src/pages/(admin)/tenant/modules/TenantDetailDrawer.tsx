import { Alert, Badge, Button, Card, Descriptions, Drawer, Flex, Spin, Tag, Typography } from 'antd';

import { useTenantDetailQuery } from '@/service/api/system-tenant';
import type { TenantId } from '@/service/api/system-tenant';
import type { TenantPackageOption } from '@/service/api/system-tenant-package';

import {
  formatAccountCount,
  formatTenantMinute,
  formatTenantStatus,
  isManagementTenant,
  resolveTenantExpiry,
  resolveTenantExpiryColor,
  resolveTenantPackageName
} from './tenant-utils';

interface TenantDetailDrawerProps {
  /** 关闭详情抽屉。 */
  onClose: () => void;
  /** 转到编辑当前租户。 */
  onEdit: () => void;
  /** 抽屉是否打开。 */
  open: boolean;
  /** 套餐下拉选项，用于把 packageId 映射成名称。 */
  packageOptions: TenantPackageOption[];
  /** 当前查看的租户主键。 */
  tenantId?: TenantId;
}

/** 空值统一显示为破折号，不留空白：空白读起来像"加载失败"。 */
function orDash(value: null | string | undefined) {
  return value?.trim() || '—';
}

const TenantDetailDrawer = (props: TenantDetailDrawerProps) => {
  const { onClose, onEdit, open, packageOptions, tenantId } = props;

  const detailQuery = useTenantDetailQuery(tenantId, open);
  const tenant = detailQuery.data;
  const protectedTenant = tenant ? isManagementTenant(tenant) : false;
  const expiry = resolveTenantExpiry(tenant?.expireTime ?? null);

  return (
    <Drawer
      destroyOnHidden
      open={open}
      title="租户详情"
      width={640}
      footer={
        <Flex
          gap={8}
          justify="flex-end"
        >
          <Button onClick={onClose}>关闭</Button>
          <Button
            disabled={!tenant || protectedTenant}
            type="primary"
            onClick={onEdit}
          >
            编辑资料
          </Button>
        </Flex>
      }
      onClose={onClose}
    >
      {detailQuery.isError ? (
        <Alert
          className="mb-16px"
          showIcon
          title="租户详情加载失败"
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
        {tenant ? (
          <div className="flex flex-col gap-16px">
            <Flex
              align="center"
              gap={12}
            >
              <span className="size-48px grid shrink-0 place-items-center rounded-8px bg-primary-50 text-18px text-primary font-700">
                {(tenant.companyName || '租').slice(0, 1)}
              </span>
              <div className="min-w-0 flex-1">
                <Flex
                  align="center"
                  gap={8}
                  wrap="wrap"
                >
                  <Typography.Title
                    className="mb-0!"
                    level={4}
                  >
                    {tenant.companyName || '未命名企业'}
                  </Typography.Title>
                  {protectedTenant ? (
                    <Tag
                      className="m-0"
                      color="gold"
                      variant="filled"
                    >
                      平台基座
                    </Tag>
                  ) : null}
                </Flex>
                <Typography.Text
                  className="font-mono"
                  copyable={{ text: tenant.tenantId }}
                  type="secondary"
                >
                  租户编号 {tenant.tenantId}
                </Typography.Text>
              </div>
              <Badge
                status={tenant.status === '0' ? 'success' : 'error'}
                text={formatTenantStatus(tenant.status)}
              />
            </Flex>

            <Card
              size="small"
              title="套餐与生命周期"
            >
              <Descriptions
                column={1}
                size="small"
                items={[
                  {
                    children: resolveTenantPackageName(packageOptions, tenant.packageId) || '—',
                    key: 'packageId',
                    label: '租户套餐'
                  },
                  {
                    children: formatAccountCount(tenant.accountCount),
                    key: 'accountCount',
                    label: '用户上限'
                  },
                  {
                    children: (
                      <span className={resolveTenantExpiryColor(expiry.level)}>
                        {expiry.level === 'never' ? expiry.note : `${expiry.date}（${expiry.note}）`}
                      </span>
                    ),
                    key: 'expireTime',
                    label: '有效期'
                  },
                  {
                    children: formatTenantMinute(tenant.createTime) || '—',
                    key: 'createTime',
                    label: '创建时间'
                  }
                ]}
              />
            </Card>

            <Card
              size="small"
              title="企业资料"
            >
              <Descriptions
                column={1}
                size="small"
                items={[
                  {
                    children: `${orDash(tenant.contactUserName)} · ${orDash(tenant.contactPhone)}`,
                    key: 'contact',
                    label: '联系人'
                  },
                  { children: orDash(tenant.licenseNumber), key: 'licenseNumber', label: '社会信用代码' },
                  { children: orDash(tenant.domain), key: 'domain', label: '绑定域名' },
                  { children: orDash(tenant.address), key: 'address', label: '企业地址' },
                  { children: orDash(tenant.intro), key: 'intro', label: '企业简介' },
                  { children: orDash(tenant.remark), key: 'remark', label: '备注' }
                ]}
              />
            </Card>

            <Alert
              showIcon
              type={protectedTenant ? 'warning' : 'info'}
              description={
                protectedTenant
                  ? '管理租户承载全平台的菜单、字典和初始配置，不能修改、停用或删除。'
                  : '套餐内容变更不会自动作用到这家租户，需要在行操作里执行一次“同步套餐”。'
              }
              title={protectedTenant ? '平台基座受保护' : '套餐变更不会自动同步'}
            />
          </div>
        ) : null}
      </Spin>
    </Drawer>
  );
};

export default TenantDetailDrawer;
