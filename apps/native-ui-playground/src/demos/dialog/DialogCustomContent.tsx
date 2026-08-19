import { Button, Divider, Text, showConfirmDialog } from '@skyroc/native-ui';
import { View } from 'react-native';

const DialogCustomContent = () => {
  function handleOpen() {
    showConfirmDialog({
      children: (
        <View className="overflow-hidden rounded-xl border border-border">
          <View className="p-3">
            <Text className="font-medium text-foreground">自定义内容区域</Text>
            <Text className="mt-1 text-sm text-muted-foreground">这里由 children 渲染，可组合组件库内容。</Text>
          </View>
          <Divider />
          <View className="bg-muted p-3">
            <Text className="text-sm text-muted-foreground">边界、留白和层级不会改变 Dialog 行为。</Text>
          </View>
        </View>
      ),
      message: '正文下方追加自定义节点。',
      title: '自定义内容'
    });
  }

  return (
    <View className="bg-background p-4">
      <Button
        variant="tonal"
        onPress={handleOpen}
      >
        打开自定义内容
      </Button>
    </View>
  );
};

export { DialogCustomContent };
