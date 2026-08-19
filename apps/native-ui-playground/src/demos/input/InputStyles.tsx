import { Input } from '@skyroc/native-ui';
import { View } from 'react-native';

/** className 落在 root，classNames 逐槽覆盖 */
const InputStyles = () => {
  return (
    <View className="gap-3 bg-background p-4">
      <Input
        className="border-success bg-success/10"
        placeholder="className 覆盖 root"
      />
      <Input
        classNames={{ control: 'text-primary font-semibold' }}
        defaultValue="classNames.control 覆盖输入区"
      />
      <Input
        clearable
        classNames={{ action: 'opacity-40' }}
        defaultValue="classNames.action 覆盖功能按钮"
      />
    </View>
  );
};

export { InputStyles };
