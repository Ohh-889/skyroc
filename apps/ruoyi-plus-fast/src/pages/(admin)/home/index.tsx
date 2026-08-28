// oxlint-disable import/no-unassigned-import
import { SvgIcon } from '@shell/ui/compose';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import dayjs from 'dayjs';

import { fetchNotificationInbox } from '@/service/api/notification';
import type { NotificationCategory, NotificationInboxItem } from '@/service/api/notification';
import { useUserInfoQuery } from '@/service/api/system-user';

import './style.css';

interface HomeHeroProps {
  /** 当前登录人的显示名称。 */
  nickname: string;
  /** 页面跳转入口。 */
  onOpenPage: (path: Router.RoutePath) => void;
}

interface HomeQuickEntriesProps {
  /** 页面跳转入口。 */
  onOpenPage: (path: Router.RoutePath) => void;
}

interface HomeNotificationsProps {
  /** 通知列表接口是否失败。 */
  isError: boolean;
  /** 通知列表是否正在加载。 */
  isLoading: boolean;
  /** 最近通知。 */
  notifications: NotificationInboxItem[];
  /** 页面跳转入口。 */
  onOpenPage: (path: Router.RoutePath) => void;
}

interface QuickEntry {
  /** 入口的辅助说明。 */
  description: string;
  /** 入口图标。 */
  icon: string;
  /** 入口名称。 */
  label: string;
  /** 对应的应用路由。 */
  path: Router.RoutePath;
  /** 入口强调色。 */
  tone: 'blue' | 'cyan' | 'orange' | 'purple';
}

const quickEntries: QuickEntry[] = [
  {
    description: '维护部门、岗位与成员',
    icon: 'ph:users-three',
    label: '组织与用户',
    path: '/system/user',
    tone: 'blue'
  },
  {
    description: '配置角色与数据范围',
    icon: 'ph:shield-check',
    label: '角色权限',
    path: '/system/role',
    tone: 'purple'
  },
  { description: '管理租户与授权状态', icon: 'ph:buildings', label: '租户管理', path: '/tenant/list', tone: 'cyan' },
  { description: '查看服务与缓存状态', icon: 'ph:pulse', label: '系统监控', path: '/monitor/cache', tone: 'orange' }
];

const categoryLabels: Record<NotificationCategory, string> = {
  alert: '异常',
  announcement: '公告',
  event: '动态',
  message: '消息',
  security: '安全',
  task: '待办'
};

function getGreeting(hour: number) {
  if (hour < 6) return '夜深了';
  if (hour < 12) return '早上好';
  if (hour < 18) return '下午好';
  return '晚上好';
}

const HomeHero = (props: HomeHeroProps) => {
  const { nickname } = props;
  const greeting = getGreeting(dayjs().hour());
  const today = dayjs().format('M 月 D 日 · dddd');

  return (
    <section className="skyroc-home-hero">
      <div className="skyroc-home-hero-copy">
        <span className="skyroc-home-date">{today}</span>
        <h1>
          {greeting}，{nickname}
        </h1>
        <p>这里是你的管理工作台。先处理重要事项，再继续今天的工作。</p>
      </div>
      <div
        className="skyroc-home-hero-visual"
        aria-hidden="true"
      >
        <div className="skyroc-home-orbit skyroc-home-orbit-one" />
        <div className="skyroc-home-orbit skyroc-home-orbit-two" />
        <div className="skyroc-home-core">
          <SystemLogo />
        </div>
        <span className="skyroc-home-node is-users">
          <SvgIcon icon="ph:users-three" />
        </span>
        <span className="skyroc-home-node is-shield">
          <SvgIcon icon="ph:shield-check" />
        </span>
        <span className="skyroc-home-node is-bell">
          <SvgIcon icon="ph:bell" />
        </span>
      </div>
    </section>
  );
};

const HomeQuickEntries = (props: HomeQuickEntriesProps) => {
  const { onOpenPage } = props;

  return (
    <article className="skyroc-home-card skyroc-home-quick-card">
      <header className="skyroc-home-card-header">
        <div>
          <h2>常用功能</h2>
          <p>快速进入日常管理模块</p>
        </div>
      </header>
      <div className="skyroc-home-quick-list">
        {quickEntries.map(entry => (
          <button
            key={entry.path}
            type="button"
            onClick={() => onOpenPage(entry.path)}
          >
            <span className={`is-${entry.tone}`}>
              <SvgIcon icon={entry.icon} />
            </span>
            <div>
              <strong>{entry.label}</strong>
              <small>{entry.description}</small>
            </div>
            <SvgIcon
              className="skyroc-home-entry-arrow"
              icon="ph:caret-right"
            />
          </button>
        ))}
      </div>
    </article>
  );
};

const HomeNotifications = (props: HomeNotificationsProps) => {
  const { isError, isLoading, notifications } = props;

  function formatNotificationTime(value: string) {
    return dayjs(value).format('MM-DD HH:mm');
  }

  return (
    <article className="skyroc-home-card skyroc-home-notice-card">
      <header className="skyroc-home-card-header">
        <div>
          <h2>最新通知</h2>
          <p>与你相关的最近消息</p>
        </div>
        <AButton
          type="link"
        >
          查看全部
        </AButton>
      </header>
      <div className="skyroc-home-notice-list">
        {isLoading ? (
          <ASkeleton
            active
            paragraph={{ rows: 4 }}
            title={false}
          />
        ) : null}
        {!isLoading && isError ? (
          <AEmpty
            description="通知暂时无法加载"
            image={AEmpty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : null}
        {!isLoading && !isError && notifications.length === 0 ? (
          <AEmpty
            description="暂无通知"
            image={AEmpty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : null}
        {notifications.map(item => (
          <button
            key={item.msgId}
            type="button"
          >
            <span className={`is-${item.category}`}>
              <SvgIcon icon={item.readTime ? 'ph:envelope-open' : 'ph:envelope-simple'} />
            </span>
            <div>
              <strong>{item.title}</strong>
              <small>{item.summary || categoryLabels[item.category]}</small>
            </div>
            <time>{formatNotificationTime(item.publishTime)}</time>
          </button>
        ))}
      </div>
    </article>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const { data: userInfo } = useUserInfoQuery();

  const {
    data: inbox,
    isError: inboxError,
    isLoading: inboxLoading
  } = useQuery({
    queryFn: () => fetchNotificationInbox({ current: 1, size: 5 }),
    queryKey: ['home', 'notification-inbox'],
    retry: false
  });

  const nickname = userInfo?.nickname || userInfo?.userName || '管理员';

  function openPage(path: Router.RoutePath) {
    navigate({ to: path });
  }

  return (
    <main className="skyroc-home">
      <HomeHero
        nickname={nickname}
        onOpenPage={openPage}
      />

      <section className="skyroc-home-grid">
        <HomeQuickEntries onOpenPage={openPage} />
        <HomeNotifications
          isError={inboxError}
          isLoading={inboxLoading}
          notifications={inbox?.records ?? []}
          onOpenPage={openPage}
        />
      </section>
    </main>
  );
};

export const Route = createFileRoute('/(admin)/home/')({
  component: Home,
  staticData: { i18nKey: 'route.home', menu: { icon: 'mdi:monitor-dashboard', order: 1 }, title: 'home' }
});
