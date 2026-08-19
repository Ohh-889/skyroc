import { Tag, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { Alert, View } from 'react-native';

const TagCloseable = () => {
  const [visible, setVisible] = useState(true);

  return (
    <View className="flex-row flex-wrap items-center gap-3 bg-background p-4">
      {visible ? (
        <Tag
          closeable
          onClose={() => setVisible(false)}
        >
          Click to close
        </Tag>
      ) : (
        <Text className="text-sm text-muted-foreground">Tag closed</Text>
      )}
      <Tag
        closeable
        color="success"
        onClose={() => Alert.alert('Close')}
      >
        Success
      </Tag>
      <Tag
        closeable
        color="warning"
        variant="tonal"
        onClose={() => Alert.alert('Close')}
      >
        Warning
      </Tag>
    </View>
  );
};

export { TagCloseable };
