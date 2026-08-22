import { Button, Switch, Tabs, Tag, Text } from '@skyroc/native-ui';
import type { TagColor } from '@skyroc/native-ui';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import type { Order, OrderQuery, OrderStatus } from '@/feature/demo/mock-api';
import { fetchOrderList } from '@/feature/demo/mock-api';
import { QueryList } from '@/feature/list';
import { DemoHeader } from '../modules/DemoHeader';

/** 状态到中文标签和标签色的映射 */
const STATUS_META: Record<OrderStatus, { color: TagColor; label: string }> = {
  completed: { color: 'success', label: '已完成' },
  pending: { color: 'warning', label: '待付款' },
  refunding: { color: 'destructive', label: '退款中' },
  shipped: { color: 'info', label: '待收货' }
};

const TABS: { key: OrderQuery['status']; title: string }[] = [
  { key: 'all', title: '全部' },
  { key: 'pending', title: '待付款' },
  { key: 'shipped', title: '待收货' },
  { key: 'completed', title: '已完成' },
  { key: 'refunding', title: '退款中' }
];

function formatAmount(amount: number) {
  return `¥${(amount / 100).toFixed(2)}`;
}

const OrderCard = ({ item }: { item: Order }) => {
  const meta = STATUS_META[item.status];

  return (
    <View className="mb-3 overflow-hidden rounded-2xl border border-border/60 bg-card">
      <View className="flex-row items-center justify-between border-b border-border/40 px-4 py-3">
        <Text
          numberOfLines={1}
          size="sm"
          weight="medium"
        >
          {item.shopName}
        </Text>

        <Tag
          color={meta.color}
          size="sm"
          variant="tonal"
        >
          {meta.label}
        </Tag>
      </View>

      <View className="flex-row gap-3 p-4">
        {/* demo 不依赖外网图片，用色块占位；真实项目这里换成 <Image src={item.cover} /> */}
        <View
          className="size-20 rounded-xl"
          style={{ backgroundColor: item.coverColor }}
        />

        <View className="flex-1 justify-between">
          <Text
            numberOfLines={2}
            size="sm"
          >
            {item.title}
          </Text>

          <View className="flex-row items-end justify-between">
            <Text
              color="muted"
              size="xs"
            >
              共 {item.itemCount} 件 · {item.createdAt}
            </Text>

            <Text weight="semibold">{formatAmount(item.amount)}</Text>
          </View>
        </View>
      </View>

      <View className="flex-row justify-end gap-2 px-4 pb-4">
        <Button
          color="muted"
          shape="pill"
          size="sm"
          variant="outline"
        >
          联系客服
        </Button>

        <Button
          shape="pill"
          size="sm"
          variant={item.status === 'pending' ? 'solid' : 'outline'}
        >
          {item.status === 'pending' ? '去付款' : '再来一单'}
        </Button>
      </View>
    </View>
  );
};

/** 单个 tab 面板：一个 status 对应一条独立的分页缓存 */
const OrderPanel = ({ shouldFail, status }: { shouldFail: boolean; status: OrderQuery['status'] }) => {
  return (
    <QueryList
      emptyText="这个状态下还没有订单"
      errorText="订单加载失败，检查下网络再试"
      params={{ shouldFail, status }}
      queryKey={['demo', 'orders']}
      request={fetchOrderList}
      classNames={{ content: 'px-4 pb-10 pt-3' }}
      renderItem={({ item }) => <OrderCard item={item} />}
    />
  );
};

export default function OrdersScreen() {
  const [shouldFail, setShouldFail] = useState(false);

  // params 是 queryKey 的一部分，所以 shouldFail / status 一变就会自动换一条缓存重新从第一页拉，
  // 不需要在页面里手动 reset 页码或清空列表
  const items = TABS.map(tab => ({
    children: (
      <OrderPanel
        shouldFail={shouldFail}
        status={tab.key}
      />
    ),
    key: tab.key,
    title: tab.title
  }));

  return (
    <View className="flex-1 bg-background">
      <DemoHeader title="我的订单" />

      <Pressable
        className="flex-row items-center justify-between border-b border-border/40 px-4 py-3"
        onPress={() => setShouldFail(previous => !previous)}
      >
        <View className="flex-1 gap-0.5 pr-4">
          <Text size="sm">模拟请求失败</Text>

          <Text
            color="muted"
            size="xs"
          >
            打开后请求直接抛错，可以看错误占位和「重试」；「退款中」那栏是空态
          </Text>
        </View>

        <Switch
          checked={shouldFail}
          onCheckedChange={setShouldFail}
        />
      </Pressable>

      <Tabs
        lazy
        items={items}
        type="line"
      />
    </View>
  );
}
