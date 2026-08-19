import { DropdownMenu } from '@skyroc/native-ui';
import type { DropdownMenuItem } from '@skyroc/native-ui';
import { View } from 'react-native';

const MOTION_ITEM: DropdownMenuItem = {
  key: 'motion',
  options: [
    { text: '选项一', value: 'one' },
    { text: '选项二', value: 'two' },
    { text: '选项三', value: 'three' }
  ],
  title: '600ms 动画'
};

const DropdownMenuMotion = () => {
  return (
    <View className="bg-background">
      <DropdownMenu
        duration={600}
        haptic={false}
        items={[MOTION_ITEM]}
      />
    </View>
  );
};

export { DropdownMenuMotion };
