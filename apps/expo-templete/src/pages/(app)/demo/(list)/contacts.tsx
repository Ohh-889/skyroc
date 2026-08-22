import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Avatar, Search, Text } from '@skyroc/native-ui';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { withUniwind } from 'uniwind';

import type { Contact, ContactQuery } from '@/feature/demo/mock-api';
import { fetchContactList, fetchContactOverview } from '@/feature/demo/mock-api';
import { QueryList } from '@/feature/list';
import type { QueryListHandle } from '@/feature/list';
import { useDebouncedValue } from '@/hooks/use-debounced-value';

import { DemoHeader } from '../modules/DemoHeader';

const Icon = withUniwind(MaterialCommunityIcons);

/** 字母头像的五套配色，按 id 散列挑一套，避免整屏都是同一个色块 */
const AVATAR_TONES = [
  { text: 'text-primary', tint: 'bg-primary/15' },
  { text: 'text-info', tint: 'bg-info/15' },
  { text: 'text-success', tint: 'bg-success/15' },
  { text: 'text-warning', tint: 'bg-warning/15' },
  { text: 'text-destructive', tint: 'bg-destructive/15' }
];

function pickTone(id: string) {
  const seed = [...id].reduce((sum, char) => sum + char.charCodeAt(0), 0);

  return AVATAR_TONES[seed % AVATAR_TONES.length];
}

interface ContactAvatarProps {
  contact: Contact;
  size: 'lg' | 'md';
}

const ContactAvatar = ({ contact, size }: ContactAvatarProps) => {
  const tone = pickTone(contact.id);

  return (
    <View>
      <Avatar
        size={size}
        classNames={{ fallbackText: tone.text, root: tone.tint }}
        fallback={contact.name.slice(-2)}
      />

      <View
        className={`absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-background ${
          contact.online ? 'bg-success' : 'bg-muted-foreground/40'
        }`}
      />
    </View>
  );
};

/** 部门组头：负 margin 拉成通栏灰条，是通讯录里最省事也最好认的分组样式 */
const DepartmentHeader = ({ department }: { department: string }) => (
  <View className="-mx-4 mt-1 flex-row items-center gap-1.5 bg-muted/60 px-4 py-1.5">
    <Icon
      colorClassName="accent-muted-foreground"
      name="folder-outline"
      size={12}
    />

    <Text
      color="muted"
      size="2xs"
      weight="semibold"
    >
      {department}
    </Text>
  </View>
);

const ContactRow = ({ item }: { item: Contact }) => (
  <Pressable className="flex-row items-center gap-3 py-2.5 active:opacity-60">
    <ContactAvatar
      contact={item}
      size="md"
    />

    <View className="flex-1 gap-1">
      <View className="flex-row items-center gap-1.5">
        <Text
          className="flex-shrink"
          numberOfLines={1}
          size="sm"
          weight="medium"
        >
          {item.name}
        </Text>

        <View className="rounded bg-muted px-1.5 py-px">
          <Text
            color="muted"
            size="2xs"
          >
            {item.title}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center gap-1">
        <Icon
          colorClassName="accent-muted-foreground"
          name="phone-outline"
          size={11}
        />

        <Text
          color="muted"
          size="2xs"
        >
          分机 {item.phone}
        </Text>
      </View>
    </View>

    <Pressable className="size-8 items-center justify-center rounded-full bg-primary/10 active:opacity-60">
      <Icon
        colorClassName="accent-primary"
        name="phone"
        size={15}
      />
    </Pressable>
  </Pressable>
);

/** 常用联系人骨架：加载时占住同样的高度，数据回来时不会把下面的列表顶一下 */
const FrequentSkeleton = () => (
  <View className="-mx-4 flex-row gap-3 px-4">
    {Array.from({ length: 5 }, (_, index) => (
      <View
        key={index}
        className="w-12 items-center gap-1.5"
      >
        <View className="size-12 rounded-full bg-muted" />

        <View className="h-2.5 w-8 rounded-full bg-muted" />
      </View>
    ))}
  </View>
);

export default function ContactsScreen() {
  const [keyword, setKeyword] = useState('');

  // 每敲一个字都换一次 queryKey 的话，会连着打出一串很快作废的请求，所以先防抖再进 params
  const debouncedKeyword = useDebouncedValue(keyword);

  const searching = debouncedKeyword.trim().length > 0;

  const listRef = useRef<QueryListHandle<Contact>>(null);

  /**
   * 换关键词后滚回顶部。
   *
   * 换 params 只会换一条缓存重新拉数据，滚动位置是 FlatList 自己的状态，不会跟着回到 0 —— 在第三屏搜一个只有两条结果的词，人还停在滚动深处对着空白。
   */
  useEffect(() => {
    listRef.current?.scrollToTop(false);
  }, [debouncedKeyword]);

  // 头部概览不分页，用普通 useQuery 就够了；和下面的分页列表共用同一个 QueryClient，互不干扰
  const { data: overview, isPending } = useQuery({
    queryFn: fetchContactOverview,
    queryKey: ['demo', 'contacts', 'overview']
  });

  function renderHeader() {
    // 搜索态下把常用联系人换成结果统计，屏幕就这么大，两个都留着只会互相挤
    if (searching) {
      return (
        <View className="flex-row items-center gap-1.5 pb-1 pt-4">
          <Icon
            colorClassName="accent-muted-foreground"
            name="magnify"
            size={13}
          />

          <Text
            color="muted"
            size="xs"
          >
            «{debouncedKeyword}» 的搜索结果
          </Text>
        </View>
      );
    }

    return (
      <View className="gap-2.5 pb-2 pt-4">
        <View className="flex-row items-center justify-between">
          <Text
            color="muted"
            size="xs"
            weight="semibold"
          >
            常用联系人
          </Text>

          {overview ? (
            <Text
              color="muted"
              size="2xs"
            >
              {overview.onlineCount} / {overview.total} 人在线
            </Text>
          ) : null}
        </View>

        {isPending || !overview ? (
          <FrequentSkeleton />
        ) : (
          <ScrollView
            horizontal
            className="-mx-4"
            contentContainerClassName="gap-3 px-4"
            showsHorizontalScrollIndicator={false}
          >
            {overview.frequent.map(contact => (
              <Pressable
                className="w-12 items-center gap-1.5 active:opacity-60"
                key={contact.id}
              >
                <ContactAvatar
                  contact={contact}
                  size="lg"
                />

                <Text
                  numberOfLines={1}
                  size="2xs"
                >
                  {contact.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        )}
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <DemoHeader title="通讯录" />

      <View className="flex-row items-center gap-2 px-4 pb-2 pt-1">
        <View className="flex-1">
          <Search
            clearable
            placeholder="搜索姓名、部门或职位"
            value={keyword}
            onChangeText={setKeyword}
            onClear={() => setKeyword('')}
          />
        </View>

        {/* 页头的按钮要操作列表，靠 ref 就够了，不必为此把整页换成 useInfiniteList + List */}
        <Pressable
          className="size-9 items-center justify-center rounded-full bg-muted active:opacity-60"
          onPress={() => listRef.current?.refresh()}
        >
          <Icon
            colorClassName="accent-muted-foreground"
            name="sync"
            size={16}
          />
        </Pressable>
      </View>

      <QueryList<Contact, ContactQuery>
        ref={listRef}
        emptyText={searching ? `没有匹配「${debouncedKeyword}」的同事` : '通讯录是空的'}
        params={{ keyword: debouncedKeyword }}
        queryKey={['demo', 'contacts']}
        request={fetchContactList}
        classNames={{ content: 'px-4 pb-10' }}
        ListHeaderComponent={renderHeader()}
        renderItem={({ item }) => (
          <>
            {/* isDepartmentStart 由服务端在分页前算好，客户端比对上一条的话第二页的组头会漏掉 */}
            {item.isDepartmentStart ? <DepartmentHeader department={item.department} /> : null}

            <ContactRow item={item} />
          </>
        )}
      />
    </View>
  );
}
