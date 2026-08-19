import { TreeSelect } from '@skyroc/native-ui';
import type { TreeSelectItem } from '@skyroc/native-ui';
import { View } from 'react-native';

const BADGE_ITEMS: TreeSelectItem[] = [
  { children: [{ id: 'all-1', text: '全部订单' }], id: 'all', text: '全部' },
  { badge: 3, children: [{ id: 'pay-1', text: '待付款订单' }], id: 'pay', text: '待付款' },
  { children: [{ id: 'ship-1', text: '待收货订单' }], dot: true, id: 'ship', text: '待收货' },
  { badge: 128, children: [{ id: 'refund-1', text: '退款订单' }], id: 'refund', text: '退款' }
];

const TreeSelectBadge = () => {
  return (
    <View className="bg-background p-4">
      <View className="overflow-hidden rounded-xl border border-border/60">
        <TreeSelect
          defaultActiveId="pay-1"
          defaultMainActiveIndex={1}
          items={BADGE_ITEMS}
          height={220}
        />
      </View>
    </View>
  );
};

export { TreeSelectBadge };
