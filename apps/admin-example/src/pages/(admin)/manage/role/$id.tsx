import { LookForward } from '@shell/ui/compose';
import { createFileRoute, useLoaderData } from '@tanstack/react-router';
import { Card, Descriptions, Tag } from 'antd';
import type { DescriptionsProps } from 'antd';
import { useTranslation } from 'react-i18next';

import { fetchGetRoleList } from '@/service/api/system-manage/api';

import { enableStatusTagColorRecord, roleStatusRecord } from './modules/shared';

type DescriptionItem = NonNullable<DescriptionsProps['items']>[number];

interface RoleDescriptionOptions {
  /** Role record loaded by route loader. */
  role: Api.SystemManage.Role;
  /** Translate function from current locale. */
  t: ReturnType<typeof useTranslation>['t'];
}

const RoleDetail = () => {
  const { t } = useTranslation();
  const role = useLoaderData({ strict: false }) as Api.SystemManage.Role | null;

  if (!role) {
    return <LookForward title={t('common.noData')} />;
  }

  const items = createRoleDescriptionItems({ role, t });

  return (
    <Card className="h-full card-wrapper" title={t('page.manage.roleDetail.title')} variant="borderless">
      <Descriptions bordered column={{ lg: 2, md: 2, sm: 1, xs: 1 }} items={items} />
      <div className="mt-16px text-center text-16px text-secondary">
        {t('page.manage.roleDetail.explain')}
      </div>
    </Card>
  );
};

export const Route = createFileRoute('/(admin)/manage/role/$id')({
  component: RoleDetail,
  loader: async ({ context, params }) => {
    const queryParams: Api.SystemManage.RoleSearchParams = {
      current: 1,
      roleCode: null,
      roleName: null,
      size: 1000,
      status: null
    };
    const data: Api.SystemManage.RoleList = await context.queryClient.ensureQueryData({
      queryFn: () => fetchGetRoleList(queryParams),
      queryKey: roleListQueryKey(queryParams)
    });

    return data.records.find(item => String(item.id) === params.id) ?? null;
  },
  staticData: {
    i18nKey: 'route.manage_role_$id',
    menu: {
      activeMenu: '/manage/role',
      hide: true
    },
    permissions: ['R_ADMIN'],
    title: 'role_detail'
  }
});

function roleListQueryKey(params: Api.SystemManage.RoleSearchParams) {
  return ['systemManage', 'roleList', params] as const;
}

function createRoleDescriptionItems(options: RoleDescriptionOptions): DescriptionItem[] {
  const { role, t } = options;

  return [
    {
      children: role.id,
      key: 'id',
      label: 'ID'
    },
    {
      children: role.roleName,
      key: 'roleName',
      label: t('page.manage.role.roleName')
    },
    {
      children: role.roleCode,
      key: 'roleCode',
      label: t('page.manage.role.roleCode')
    },
    {
      children: role.roleDesc || '-',
      key: 'roleDesc',
      label: t('page.manage.role.roleDesc')
    },
    {
      children: renderStatus(role.status, t),
      key: 'status',
      label: t('page.manage.role.roleStatus')
    },
    {
      children: role.createTime,
      key: 'createTime',
      label: t('common.createTime')
    },
    {
      children: role.updateTime,
      key: 'updateTime',
      label: t('common.updateTime')
    }
  ];
}

function renderStatus(value: Api.Common.EnableStatus | null, t: ReturnType<typeof useTranslation>['t']) {
  if (!value) return '-';

  return <Tag color={enableStatusTagColorRecord[value]}>{t(roleStatusRecord.status[value])}</Tag>;
}
