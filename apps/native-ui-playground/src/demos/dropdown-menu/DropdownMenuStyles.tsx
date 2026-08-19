import { DropdownMenu } from '@skyroc/native-ui';
import type { DropdownMenuItem } from '@skyroc/native-ui';
import { View } from 'react-native';

const STYLE_ITEM: DropdownMenuItem = {
  key: 'style',
  options: [
    { text: '默认样式', value: 'default' },
    { text: '强调选项', value: 'accent' },
    { text: '柔和选项', value: 'muted' }
  ],
  title: '自定义样式'
};

const DropdownMenuStyles = () => {
  return (
    <View className="bg-background p-4">
      <DropdownMenu
        className="rounded-xl border border-primary/20"
        classNames={{
          arrow: 'accent-primary',
          bar: 'rounded-xl bg-primary/5',
          divider: 'mx-3',
          option: 'mx-2 rounded-lg px-3',
          optionText: 'text-primary',
          selectedIcon: 'accent-warning',
          titleText: 'font-medium text-primary'
        }}
        items={[STYLE_ITEM]}
      />
    </View>
  );
};

export { DropdownMenuStyles };
