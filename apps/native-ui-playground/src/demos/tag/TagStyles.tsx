import { Tag } from '@skyroc/native-ui';
import { View } from 'react-native';

const TagStyles = () => {
  return (
    <View className="flex-row flex-wrap items-center gap-3 bg-background p-4">
      <Tag
        closeable
        className="h-8 border border-primary/30 bg-primary/10 px-3"
        classNames={{ close: 'rounded-full bg-primary/10 p-0.5', closeIcon: 'accent-primary', text: 'text-primary' }}
        variant="ghost"
      >
        自定义标签
      </Tag>
    </View>
  );
};

export { TagStyles };
