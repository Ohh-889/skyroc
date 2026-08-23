import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Text, showSuccessToast } from '@skyroc/native-ui';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { withUniwind } from 'uniwind';

import { DEMO_QUERY_KEYS, MessageCard, MessageDayDivider, MessageFilterBar, fetchMessageList } from '@/feature/demo';
import type { Message, MessageQuery } from '@/feature/demo';
import { List, useInfiniteList } from '@/feature/list';

import { DemoHeader } from '../modules/DemoHeader';

const Icon = withUniwind(MaterialCommunityIcons);

/** 顶部概览卡：把 total / 已加载 / 未读 三个数摆在一起，正好说明它们各自从哪来 */
interface OverviewProps {
  loaded: number;
  onMarkAll: () => void;
  total: number;
  unread: number;
}

const MessageOverview = (props: OverviewProps) => {
  const { loaded, onMarkAll, total, unread } = props;

  const stats = [
    { label: '总条数', value: total },
    { label: '已加载', value: loaded },
    { label: '未读', value: unread }
  ];

  return (
    <View className="mx-4 mt-3 overflow-hidden rounded-2xl border border-border/60 bg-card">
      <View className="flex-row items-center justify-between gap-3 px-4 pb-3 pt-4">
        <View className="flex-1 flex-row items-end gap-2">
          <Text
            className="text-4xl leading-none"
            color={unread > 0 ? 'primary' : 'muted'}
            weight="bold"
          >
            {unread}
          </Text>

          <Text
            className="pb-0.5"
            color="muted"
            size="sm"
          >
            条未读消息
          </Text>
        </View>

        <Pressable
          className="flex-row items-center gap-1 rounded-full bg-primary/10 px-3 py-1.5 active:opacity-60"
          disabled={unread === 0}
          onPress={onMarkAll}
        >
          <Icon
            colorClassName={unread > 0 ? 'accent-primary' : 'accent-muted-foreground'}
            name="check-all"
            size={14}
          />

          <Text
            color={unread > 0 ? 'primary' : 'muted'}
            size="xs"
            weight="medium"
          >
            全部已读
          </Text>
        </Pressable>
      </View>

      <View className="flex-row border-t border-border/50">
        {stats.map((stat, index) => (
          <View
            key={stat.label}
            className={`flex-1 items-center py-2.5 ${index > 0 ? 'border-l border-border/50' : ''}`}
          >
            <Text
              size="sm"
              weight="semibold"
            >
              {stat.value}
            </Text>

            <Text
              color="muted"
              size="2xs"
            >
              {stat.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

/**
 * 消息中心：`useInfiniteList` + `<List>` 的样板。
 *
 * 和「消息」tab（`(tabs)/messages`）是刻意做的一组对照——同一份数据、同一套卡片，一个用 本地 `updateItem` 做纯客户端更新，一个走 mutation 打接口再 invalidate。想看后者去那一页。
 */
export default function MessagesScreen() {
  const [type, setType] = useState<MessageQuery['type']>('all');

  const { items, listProps, total, updateItem } = useInfiniteList<Message, MessageQuery>({
    params: { type },
    queryKey: DEMO_QUERY_KEYS.messages,
    request: fetchMessageList
  });

  const unreadCount = items.filter(message => !message.read).length;

  /**
   * 只改缓存里的那几条，不重新请求。
   *
   * 真实项目里这一步应该跟着一个「标记已读」的接口：先 updateItem 做乐观更新，接口失败再回滚。 这一页故意只改客户端，所以下拉刷新会把已读状态刷回服务端的值。
   */
  function markAllAsRead() {
    if (unreadCount === 0) return;

    updateItem(
      message => !message.read,
      message => ({ ...message, read: true })
    );

    showSuccessToast(`已把 ${unreadCount} 条标记为已读`);
  }

  return (
    <View className="flex-1 bg-background">
      <DemoHeader title="消息中心" />

      <MessageOverview
        loaded={items.length}
        total={total}
        unread={unreadCount}
        onMarkAll={markAllAsRead}
      />

      <View className="mt-3">
        <MessageFilterBar
          value={type}
          onChange={setType}
        />
      </View>

      <List<Message>
        {...listProps}
        emptyText="这个分类下还没有通知"
        classNames={{ content: 'px-4 pb-10' }}
        renderItem={({ index, item }) => (
          <>
            {/* 组头由「和上一条日期不同」推出来，数据在手上（useInfiniteList 返回 items）才做得到 */}
            {index === 0 || items[index - 1].dayLabel !== item.dayLabel ? (
              <MessageDayDivider label={item.dayLabel} />
            ) : null}

            <MessageCard
              item={item}
              onRead={() =>
                updateItem(
                  message => message.id === item.id,
                  message => ({ ...message, read: true })
                )
              }
            />
          </>
        )}
      />
    </View>
  );
}
