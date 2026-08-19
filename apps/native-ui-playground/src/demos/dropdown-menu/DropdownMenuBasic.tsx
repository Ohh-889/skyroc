import { DropdownMenu } from '@skyroc/native-ui';
import type { DropdownMenuItem } from '@skyroc/native-ui';
import { View } from 'react-native';

const SORT_ITEM: DropdownMenuItem = {
  key: 'sort',
  options: [
    { text: '综合排序', value: 'default' },
    { text: '好评优先', value: 'rating' },
    { text: '销量优先', value: 'sales' }
  ]
};

const FILTER_ITEM: DropdownMenuItem = {
  key: 'filter',
  options: [
    { text: '全部商品', value: 'all' },
    { text: '新品上架', value: 'new' },
    { text: '活动商品', value: 'promo' }
  ]
};

const DropdownMenuBasic = () => {
  return (
    <View className="bg-background">
      <DropdownMenu
        defaultValues={['rating', 'all']}
        items={[SORT_ITEM, FILTER_ITEM]}
      />
    </View>
  );
};

export { DropdownMenuBasic };
