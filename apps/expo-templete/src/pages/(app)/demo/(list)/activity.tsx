import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { withUniwind } from 'uniwind';

import type { Activity } from '@/feature/demo/mock-api';
import { fetchActivityList } from '@/feature/demo/mock-api';
import { List, useInfiniteList } from '@/feature/list';

import { DemoHeader } from '../modules/DemoHeader';

const Icon = withUniwind(MaterialCommunityIcons);

interface StatCardProps {
  accent: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  tint: string;
  value: number;
}

const StatCard = (props: StatCardProps) => {
  const { accent, icon, label, tint, value } = props;

  return (
    <View className="flex-1 flex-row items-center gap-2.5 rounded-2xl border border-border/60 bg-card px-3 py-2.5">
      <View className={`size-8 items-center justify-center rounded-xl ${tint}`}>
        <Icon
          colorClassName={accent}
          name={icon}
          size={16}
        />
      </View>

      <View>
        <Text
          size="base"
          weight="semibold"
        >
          {value}
        </Text>

        <Text
          color="muted"
          size="2xs"
        >
          {label}
        </Text>
      </View>
    </View>
  );
};

/** 日期组头，缩进到时间轴右侧，跟卡片左边缘对齐 */
const DayHeader = ({ label }: { label: string }) => (
  <View className="flex-row items-center gap-2 pb-2 pt-4">
    <View className="rounded-md bg-muted px-2 py-0.5">
      <Text
        color="muted"
        size="2xs"
        weight="semibold"
      >
        {label}
      </Text>
    </View>

    <View className="h-px flex-1 bg-border/60" />
  </View>
);

const ActivityRow = ({ item }: { item: Activity }) => {
  const failed = item.result === 'failed';

  return (
    <View className="flex-row">
      {/*
       * 时间轴轨道。竖线用 absolute 铺满整行高度（含右侧卡片的 pb-3），行与行之间才不会断开——
       * 原来把线画在行内的普通流里，行间距那一截是空的，连不起来。
       * 当天第一条从圆点位置起画，免得往上戳出日期标题。
       */}
      <View className="w-7 items-center">
        <View className={`absolute w-px bg-border ${item.isDayStart ? 'bottom-0 top-4' : 'inset-y-0'}`} />

        <View
          className={`mt-3.5 size-2.5 rounded-full border-2 border-background ${
            failed ? 'bg-destructive' : 'bg-primary'
          }`}
        />
      </View>

      <View className="flex-1 pb-3">
        <View
          className={`rounded-2xl border p-3 ${
            failed ? 'border-destructive/30 bg-destructive/5' : 'border-border/60 bg-card'
          }`}
        >
          <View className="flex-row items-center gap-2">
            {failed ? (
              <Icon
                colorClassName="accent-destructive"
                name="alert-circle"
                size={14}
              />
            ) : null}

            <Text
              className="flex-1"
              numberOfLines={1}
              size="sm"
              weight="medium"
            >
              {item.action}
            </Text>

            <Text
              color="muted"
              size="2xs"
            >
              {item.createdAt}
            </Text>
          </View>

          <Text
            className="mt-1"
            color="muted"
            numberOfLines={2}
            size="xs"
          >
            {item.detail}
          </Text>

          <View className="mt-2.5 flex-row items-center gap-2 border-t border-border/40 pt-2">
            <Icon
              colorClassName="accent-muted-foreground"
              name="account-circle-outline"
              size={13}
            />

            <Text
              color="muted"
              size="2xs"
            >
              {item.operator}
            </Text>

            <View className="h-2.5 w-px bg-border" />

            <Text
              color="muted"
              size="2xs"
            >
              {item.refId}
            </Text>

            <View className="flex-1" />

            <Text
              color={failed ? 'destructive' : 'success'}
              size="2xs"
              weight="medium"
            >
              {failed ? '已自动回滚' : '执行成功'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default function ActivityScreen() {
  const [expanded, setExpanded] = useState(false);

  const { items, listProps, total } = useInfiniteList<Activity>({
    queryKey: ['demo', 'activity'],
    request: fetchActivityList
  });

  const failedCount = items.filter(activity => activity.result === 'failed').length;

  return (
    <View className="flex-1 bg-background">
      <DemoHeader title="操作日志" />

      <View className="flex-row gap-3 px-4 pb-1 pt-3">
        <StatCard
          accent="accent-success"
          icon="check-circle-outline"
          label="执行成功"
          tint="bg-success/15"
          value={items.length - failedCount}
        />

        <StatCard
          accent="accent-destructive"
          icon="alert-circle-outline"
          label="执行失败"
          tint="bg-destructive/15"
          value={failedCount}
        />
      </View>

      <List<Activity>
        {...listProps}
        collapsed={!expanded}
        emptyText="这段时间没有任何操作记录"
        classNames={{ content: 'px-4 pb-10' }}
        onExpand={() => setExpanded(true)}
        renderItem={({ item }) => (
          <>
            {item.isDayStart ? <DayHeader label={item.dayLabel} /> : null}

            <ActivityRow item={item} />
          </>
        )}
        ListHeaderComponent={
          <View className="flex-row items-center gap-1.5 pt-4">
            <Icon
              colorClassName="accent-muted-foreground"
              name={expanded ? 'unfold-more-horizontal' : 'unfold-less-horizontal'}
              size={13}
            />

            <Text
              color="muted"
              size="xs"
            >
              {expanded ? `已展开全部，共 ${total} 条` : `折叠中，仅加载最近 ${items.length} 条`}
            </Text>
          </View>
        }
        /*
         * 自定义 footer：默认的 ListFooter 已经覆盖折叠 / 加载中 / 已到底三态，
         * 这里换一套贴合时间轴的写法，顺便演示 renderFooter 能拿到哪些上下文字段
         */
        renderFooter={({ collapsed, count, isEnd, isFetchingMore }) => {
          if (count === 0) return null;

          if (collapsed) {
            return (
              <Pressable
                className="ml-7 flex-row items-center justify-center gap-1.5 rounded-2xl border border-dashed border-border py-3 active:opacity-60"
                onPress={() => setExpanded(true)}
              >
                <Icon
                  colorClassName="accent-primary"
                  name="chevron-double-down"
                  size={15}
                />

                <Text
                  color="primary"
                  size="xs"
                  weight="medium"
                >
                  展开更早的 {total - count} 条记录
                </Text>
              </Pressable>
            );
          }

          if (isFetchingMore) {
            return (
              <View className="ml-7 flex-row items-center justify-center gap-2 py-4">
                <ActivityIndicator size="small" />

                <Text
                  color="muted"
                  size="xs"
                >
                  正在翻更早的记录
                </Text>
              </View>
            );
          }

          if (isEnd) {
            return (
              <View className="ml-7 flex-row items-center gap-2 py-4">
                <View className="h-px flex-1 bg-border/60" />

                <Text
                  color="muted"
                  size="2xs"
                >
                  已经到最早的一条
                </Text>

                <View className="h-px flex-1 bg-border/60" />
              </View>
            );
          }

          return null;
        }}
      />
    </View>
  );
}
