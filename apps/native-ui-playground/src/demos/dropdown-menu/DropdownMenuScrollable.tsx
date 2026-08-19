import { DropdownMenu } from '@skyroc/native-ui';
import type { DropdownMenuItem } from '@skyroc/native-ui';
import { View } from 'react-native';

/** 用来演示面板超高后内部滚动的长列表 */
const CITY_ITEM: DropdownMenuItem = {
  key: 'city',
  options: Array.from({ length: 30 }, (_, index) => ({
    text: `城市 ${index + 1}`,
    value: `city-${index + 1}`
  })),
  title: '城市'
};

const FILTER_ITEM: DropdownMenuItem = {
  key: 'filter',
  options: [
    { text: '全部商品', value: 'all' },
    { text: '新品上架', value: 'new' },
    { text: '活动商品', value: 'promo' }
  ]
};

const DropdownMenuScrollable = () => {
  return (
    <View className="bg-muted">
      <DropdownMenu
        items={[CITY_ITEM, FILTER_ITEM]}
        maxHeight={240}
      />
    </View>
  );
};

export { DropdownMenuScrollable };
