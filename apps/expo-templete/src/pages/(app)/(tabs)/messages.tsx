import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { FlashListRef } from '@shopify/flash-list';
import { Text } from '@skyroc/native-ui';
import type { Ref } from 'react';
import { useRef, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import type { ScrollViewProps } from 'react-native';
import { ScrollViewMarker } from 'react-native-screens/experimental';
import { withUniwind } from 'uniwind';

import type { Message, MessageQuery } from '@/feature/demo';
import {
  DEMO_QUERY_KEYS,
  MessageCard,
  MessageDayDivider,
  MessageFilterBar,
  fetchMessageList,
  useMarkAllMessagesReadMutation,
  useMarkMessagesReadMutation,
  useUnreadCountQuery
} from '@/feature/demo';
import { List, useInfiniteList } from '@/feature/list';

import { TabHeader } from './modules/TabHeader';

const Icon = withUniwind(MaterialCommunityIcons);

/** ScrollViewMarker 是原生视图，不吃 className，只能给 style */
const FILL = { flex: 1 } as const;

/**
 * 带 ScrollViewMarker 的滚动容器，交给 FlashList 的 `renderScrollComponent`。
 *
 * marker **只认「自己的直接子节点就是 ScrollView」**（`RNSScrollViewMarkerComponentView.mm` 的
 * `resolveScrollViewFromChildView` 不往下递归），而 FlashList v2 在自己的 ScrollView 外面还包了一层
 * 布局用的 View。所以别像另外三个 tab 那样在页面里把 `<List>` 整个套进 marker —— 那样它拿到的是那层
 * View，`RCTAssert(foundScrollView != nil)` 当场把 App 打崩，表现就是「点开这个 tab 就闪退」。
 *
 * 改成从内部接：marker 紧贴着真正的 ScrollView，而它往上找 tab bar 走的是 `reactSuperview`，
 * 塞在 FlashList 内部一样登记得上，contentInset 和 tab bar 的贴边态照常。
 */
const MarkedScrollView = (props: ScrollViewProps & { ref?: Ref<ScrollView> }) => {
  const { ref, ...rest } = props;

  return (
    <ScrollViewMarker style={FILL}>
      <ScrollView
        {...rest}
        ref={ref}
      />
    </ScrollViewMarker>
  );
};

/**
 * 「消息」tab。
 *
 * 和 `/demo/messages` 是刻意做的一组对照：同一份数据、同一套卡片，那边用 `updateItem` 只改客户端 缓存，这边走 mutation 打接口 + 乐观更新 + 失败回滚（见
 * `feature/demo/hooks`）。真实项目抄这一边。
 *
 * 未读数不从列表里数，而是单开一个 query：列表是分页的，第一页数出来的只是「已加载部分的未读数」。 同一个 query 也在 `(tabs)/_layout` 里被 tab bar
 * 的角标读着，所以这里点一条已读，底下的角标会同步减一 —— 中间没有任何跨页通信，这正是「服务端状态只放 TanStack Query」换来的。
 */
const MessagesScreen = () => {
  const [type, setType] = useState<MessageQuery['type']>('all');

  const listRef = useRef<FlashListRef<Message>>(null);

  const { data: unreadCount = 0 } = useUnreadCountQuery();

  const { items, listProps } = useInfiniteList<Message, MessageQuery>({
    params: { type },
    queryKey: DEMO_QUERY_KEYS.messages,
    request: fetchMessageList
  });

  const markRead = useMarkMessagesReadMutation();

  const markAllRead = useMarkAllMessagesReadMutation();

  const canMarkAll = unreadCount > 0 && !markAllRead.isPending;

  /** 换筛选条件时回到顶部：命中缓存的话列表不会重建，会停在上一个分类滚到的位置 */
  function handleFilterChange(next: MessageQuery['type']) {
    setType(next);

    listRef.current?.scrollToTop({ animated: false });
  }

  return (
    <View className="flex-1 bg-background">
      <TabHeader
        title="消息"
        action={
          <Pressable
            accessibilityRole="button"
            disabled={!canMarkAll}
            onPress={() => markAllRead.mutate()}
            className={`h-8 flex-row items-center gap-1 rounded-full px-3 active:opacity-60 ${
              canMarkAll ? 'bg-primary/10' : 'bg-muted'
            }`}
          >
            <Icon
              colorClassName={canMarkAll ? 'accent-primary' : 'accent-muted-foreground'}
              name="check-all"
              size={14}
            />

            <Text
              color={canMarkAll ? 'primary' : 'muted'}
              size="xs"
              weight="medium"
            >
              全部已读
            </Text>
          </Pressable>
        }
        subtitle={
          <Text
            color={unreadCount > 0 ? 'primary' : 'muted'}
            size="sm"
          >
            {unreadCount > 0 ? `${unreadCount} 条未读` : '全部已读'}
          </Text>
        }
      />

      <MessageFilterBar
        value={type}
        onChange={handleFilterChange}
      />

      <List<Message>
        {...listProps}
        contentInsetAdjustmentBehavior="automatic"
        emptyText="这个分类下还没有通知"
        ref={listRef}
        renderScrollComponent={MarkedScrollView}
        classNames={{ content: 'px-4 pb-6' }}
        renderItem={({ index, item }) => (
          <>
            {/* 组头由「和上一条日期不同」推出来。拿得到整份 items 才做得到，所以这里用
                useInfiniteList + List 而不是全托管的 QueryList */}
            {index === 0 || items[index - 1].dayLabel !== item.dayLabel ? (
              <MessageDayDivider label={item.dayLabel} />
            ) : null}

            <MessageCard
              item={item}
              onRead={() => {
                if (item.read) return;

                markRead.mutate([item.id]);
              }}
            />
          </>
        )}
      />
    </View>
  );
};

export default MessagesScreen;
