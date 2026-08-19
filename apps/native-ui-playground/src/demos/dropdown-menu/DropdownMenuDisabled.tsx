import { DropdownMenu } from '@skyroc/native-ui';
import type { DropdownMenuItem } from '@skyroc/native-ui';
import { View } from 'react-native';

/** 单个选项禁用：标题能点开，但该项选不中 */
const DISABLED_ITEM: DropdownMenuItem = {
  key: 'status',
  options: [
    { text: '默认', value: 'default' },
    { disabled: true, text: '已下架', value: 'offline' },
    { text: '热门', value: 'hot' }
  ]
};

/** 整列禁用：标题点不开 */
const LOCKED_ITEM: DropdownMenuItem = {
  disabled: true,
  key: 'locked',
  options: [{ text: '暂不可选', value: 'none' }],
  title: '暂不可选'
};

const DropdownMenuDisabled = () => {
  return (
    <View className="bg-muted">
      <DropdownMenu items={[DISABLED_ITEM, LOCKED_ITEM]} />
    </View>
  );
};

export { DropdownMenuDisabled };
