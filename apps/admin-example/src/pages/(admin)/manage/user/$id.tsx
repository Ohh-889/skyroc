import { LookForward } from '@shell/ui/compose';
import { createFileRoute, useLoaderData } from '@tanstack/react-router';
import { Card, Descriptions, Tag } from 'antd';
import type { DescriptionsProps } from 'antd';
import { useTranslation } from 'react-i18next';

import { fetchGetUserList } from '@/service/api/system-manage/api';

import { enableStatusTagColorRecord, userGenderTagColorRecord, userStatusRecord } from './modules/shared';

type DescriptionItem = NonNullable<DescriptionsProps['items']>[number];

interface UserDescriptionOptions {
  /** Translate function from current locale. */
  t: ReturnType<typeof useTranslation>['t'];
  /** User record loaded by route loader. */
  user: Api.SystemManage.User;
}

const UserDetail = () => {
  const { t } = useTranslation();
  const user = useLoaderData({ strict: false }) as Api.SystemManage.User | null;

  if (!user) {
    return <LookForward title={t('common.noData')} />;
  }

  const items = createUserDescriptionItems({ t, user });

  return (
    <Card className="h-full card-wrapper" title={t('page.manage.userDetail.title')} variant="borderless">
      <Descriptions bordered column={{ lg: 2, md: 2, sm: 1, xs: 1 }} items={items} />
      <div className="mt-16px text-center text-16px text-secondary">
        {t('page.manage.userDetail.explain')}
      </div>
    </Card>
  );
};

export const Route = createFileRoute('/(admin)/manage/user/$id')({
  component: UserDetail,
  loader: async ({ context, params }) => {
    const queryParams = { current: 1, size: 1000 };
    const data: Api.SystemManage.UserList = await context.queryClient.ensureQueryData({
      queryFn: () => fetchGetUserList(queryParams),
      queryKey: userListQueryKey(queryParams)
    });

    return data.records.find(item => String(item.id) === params.id) ?? null;
  },
  staticData: {
    i18nKey: 'route.manage_user_$id',
    menu: {
      activeMenu: '/manage/user',
      hide: true
    },
    permissions: ['R_ADMIN'],
    title: 'user_detail'
  }
});

function userListQueryKey(params: Api.SystemManage.UserSearchParams) {
  return ['systemManage', 'userList', params] as const;
}

function createUserDescriptionItems(options: UserDescriptionOptions): DescriptionItem[] {
  const { t, user } = options;

  return [
    {
      children: user.id,
      key: 'id',
      label: 'ID'
    },
    {
      children: user.userName,
      key: 'userName',
      label: t('page.manage.user.userName')
    },
    {
      children: user.nickName,
      key: 'nickName',
      label: t('page.manage.user.nickName')
    },
    {
      children: renderGender(user.userGender, t),
      key: 'userGender',
      label: t('page.manage.user.userGender')
    },
    {
      children: user.userPhone,
      key: 'userPhone',
      label: t('page.manage.user.userPhone')
    },
    {
      children: user.userEmail,
      key: 'userEmail',
      label: t('page.manage.user.userEmail')
    },
    {
      children: renderStatus(user.status, t),
      key: 'status',
      label: t('page.manage.user.userStatus')
    },
    {
      children: user.userRoles?.join(', ') || '-',
      key: 'userRoles',
      label: t('page.manage.user.userRole')
    },
    {
      children: user.createTime,
      key: 'createTime',
      label: t('common.createTime')
    },
    {
      children: user.updateTime,
      key: 'updateTime',
      label: t('common.updateTime')
    }
  ];
}

function renderGender(value: Api.SystemManage.UserGender | null, t: ReturnType<typeof useTranslation>['t']) {
  if (!value) return '-';

  return <Tag color={userGenderTagColorRecord[value]}>{t(userStatusRecord.gender[value])}</Tag>;
}

function renderStatus(value: Api.Common.EnableStatus | null, t: ReturnType<typeof useTranslation>['t']) {
  if (!value) return '-';

  return <Tag color={enableStatusTagColorRecord[value]}>{t(userStatusRecord.status[value])}</Tag>;
}
