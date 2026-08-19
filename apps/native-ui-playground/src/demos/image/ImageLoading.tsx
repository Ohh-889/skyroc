import { Button, Image, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const REMOTE_IMAGE = 'https://picsum.photos/id/1035/400/400';

const ImageLoading = () => {
  const [request, setRequest] = useState(0);

  const source = `${REMOTE_IMAGE}?request=${request}`;

  function handleReload() {
    setRequest(previous => previous + 1);
  }

  return (
    <View className="items-start gap-3 bg-background p-4">
      <View className="flex-row gap-4">
        <View className="items-center gap-1.5">
          <Image
            className="h-20 w-20"
            radius="md"
            src={source}
          />
          <Text className="text-xs text-muted-foreground">默认显示</Text>
        </View>
        <View className="items-center gap-1.5">
          <Image
            showLoading={false}
            className="h-20 w-20 bg-muted/20"
            radius="md"
            src={source}
          />
          <Text className="text-xs text-muted-foreground">showLoading=false</Text>
        </View>
      </View>
      <Button
        size="sm"
        variant="outline"
        onPress={handleReload}
      >
        重新加载
      </Button>
    </View>
  );
};

export { ImageLoading };
