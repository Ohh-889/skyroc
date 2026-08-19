import { Tag } from '@skyroc/native-ui';
import { Alert, View } from 'react-native';

const TagCombined = () => {
  return (
    <View className="flex-row flex-wrap items-center gap-3 bg-background p-4">
      <Tag
        color="primary"
        shape="pill"
        size="sm"
        variant="tonal"
      >
        Small Pill
      </Tag>
      <Tag
        closeable
        color="destructive"
        shape="pill"
        variant="outline"
        onClose={() => Alert.alert('Close')}
      >
        Closeable Pill
      </Tag>
      <Tag
        color="success"
        shape="mark"
        size="lg"
      >
        Large Mark
      </Tag>
      <Tag
        color="info"
        shape="mark"
        variant="tonal"
      >
        Tonal Mark
      </Tag>
    </View>
  );
};

export { TagCombined };
