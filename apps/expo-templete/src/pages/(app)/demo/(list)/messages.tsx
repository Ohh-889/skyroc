import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Avatar, Text, showSuccessToast } from '@skyroc/native-ui';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { withUniwind } from 'uniwind';

import type { Message, MessageQuery, MessageType } from '@/feature/demo/mock-api';
import { fetchMessageList } from '@/feature/demo/mock-api';
import { List, useInfiniteList } from '@/feature/list';

import { DemoHeader } from '../modules/DemoHeader';

const Icon = withUniwind(MaterialCommunityIcons);

/** 每种消息类型的图标与配色，头像底色、类型标签、引用块都从这里取 */
const TYPE_META: Record<MessageType, {
  accent: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  text: string;
  tint: string;
}> = {
  comment: { accent: 'accent-info', icon: 'comment-text-outline', label: '评论', text: 'text-info', tint: 'bg-info/15' },
  like: { accent: 'accent-destructive', icon: 'heart', label: '赞', text: 'text-destructive', tint: 'bg-destructive/15' },
  system: { accent: 'accent-warning', icon: 'shield-check', label: '系统', text: 'text-warning', tint: 'bg-warning/15' }
};

const FILTERS: { key: MessageQuery['type']; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'comment', label: '评论' },
  { key: 'like', label: '赞' },
  { key: 'system', label: '系统' }
];

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

/** 日期组头：一行小标题加一条延伸到底的细线，比纯文字更能把长列表切开 */
const DayDivider = ({ label }: { label: string }) => (
  <View className="flex-row items-center gap-2 px-1 pb-2 pt-5">
    <Text
      color="muted"
      size="xs"
      weight="semibold"
    >
      {label}
    </Text>

    <View className="h-px flex-1 bg-border/60" />
  </View>
);

interface MessageCardProps {
  item: Message;
  onRead: () => void;
}

const MessageCard = ({ item, onRead }: MessageCardProps) => {
  const meta = TYPE_META[item.type];

  return (
    <Pressable
      onPress={onRead}
      className={`relative overflow-hidden rounded-2xl px-3 py-3 active:opacity-70 ${
        item.read ? 'bg-transparent' : 'bg-primary/5'
      }`}
    >
      {/* 未读的左侧强调条：比单纯加粗字重更容易在快速滚动时扫到 */}
      {item.read ? null : <View className="absolute inset-y-3 left-0 w-0.5 rounded-full bg-primary" />}

      <View className="flex-row gap-3">
        {/* Avatar 的 root 自带 bg-muted，色调要挂在 root 上才盖得住，挂 fallback 槽会被底色压掉 */}
        {item.type === 'system' ? (
          <View className={`size-10 items-center justify-center rounded-full ${meta.tint}`}>
            <Icon
              colorClassName={meta.accent}
              name={meta.icon}
              size={18}
            />
          </View>
        ) : (
          <Avatar
            size="md"
            classNames={{ fallbackText: meta.text, root: meta.tint }}
            fallback={item.sender.slice(-2)}
          />
        )}

        <View className="flex-1 gap-1">
          <View className="flex-row items-center gap-2">
            <Text
              className="flex-shrink"
              numberOfLines={1}
              size="sm"
              weight={item.read ? 'normal' : 'semibold'}
            >
              {item.sender}
            </Text>

            <View className={`rounded px-1.5 py-px ${meta.tint}`}>
              <Text
                className={meta.text}
                size="2xs"
              >
                {meta.label}
              </Text>
            </View>

            <View className="flex-1" />

            <Text
              color="muted"
              size="2xs"
            >
              {item.createdAt}
            </Text>
          </View>

          <Text
            color={item.read ? 'muted' : 'foreground'}
            numberOfLines={2}
            size="sm"
          >
            {item.content}
          </Text>

          {/* 引用块：把消息挂靠的对象单独拎出来，一眼能看出这条通知是从哪来的 */}
          {item.target ? (
            <View className="mt-0.5 flex-row items-center gap-1.5 self-start rounded-lg bg-muted/70 px-2 py-1">
              <Icon
                colorClassName="accent-muted-foreground"
                name="link-variant"
                size={11}
              />

              <Text
                color="muted"
                numberOfLines={1}
                size="2xs"
              >
                {item.target}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
};

export default function MessagesScreen() {
  const [type, setType] = useState<MessageQuery['type']>('all');

  const { items, listProps, total, updateItem } = useInfiniteList<Message, MessageQuery>({
    params: { type },
    queryKey: ['demo', 'messages'],
    request: fetchMessageList
  });

  const unreadCount = items.filter(message => !message.read).length;

  /**
   * 只改缓存里的那几条，不重新请求。
   *
   * 真实项目里这一步应该跟着一个「标记已读」的接口：先 updateItem 做乐观更新，接口失败再回滚。 注意下拉刷新会重新拉服务端数据，demo
   * 的已读状态只存在客户端，刷完就回到初始值。
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

      {/* 筛选条固定在列表外面：跟着列表滚走的话，翻到第三页想换类型就得先滑回顶部 */}
      <ScrollView
        horizontal
        className="mt-3 max-h-11 flex-grow-0"
        contentContainerClassName="gap-2 px-4"
        showsHorizontalScrollIndicator={false}
      >
        {FILTERS.map(filter => {
          const active = filter.key === type;

          return (
            <Pressable
              key={filter.key}
              onPress={() => setType(filter.key)}
              className={`h-8 flex-row items-center rounded-full px-3.5 active:opacity-60 ${
                active ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <Text
                className={active ? 'text-primary-foreground' : 'text-muted-foreground'}
                size="xs"
                weight={active ? 'semibold' : 'normal'}
              >
                {filter.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <List<Message>
        {...listProps}
        emptyText="这个分类下还没有通知"
        classNames={{ content: 'px-4 pb-10' }}
        renderItem={({ index, item }) => (
          <>
            {/* 组头由「和上一条日期不同」推出来，数据在手上（useInfiniteList 返回 items）才做得到 */}
            {index === 0 || items[index - 1].dayLabel !== item.dayLabel ? <DayDivider label={item.dayLabel} /> : null}

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
