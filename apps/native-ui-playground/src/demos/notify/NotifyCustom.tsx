import { Button, Text, showNotify } from '@skyroc/native-ui';
import { View } from 'react-native';

const NotifyCustom = () => {
  return (
    <View className="flex-row flex-wrap items-center gap-3 bg-background p-4">
      <Button
        variant="tonal"
        onPress={() =>
          showNotify({
            className: 'bg-carbon',
            classNames: { content: 'py-4', message: 'text-base text-carbon-foreground' },
            message: '用 className 覆盖（跟随主题）'
          })
        }
      >
        className 覆盖
      </Button>
      <Button
        variant="tonal"
        onPress={() => showNotify({ background: '#7232dd', color: '#ffffff', message: '写死的品牌色' })}
      >
        背景色兜底
      </Button>
      <Button
        variant="tonal"
        onPress={() =>
          showNotify({
            message: (
              <View className="flex-row items-center gap-2">
                <Text className="text-2xl">🎉</Text>
                <Text className="text-sm font-medium text-primary-foreground">自定义节点</Text>
              </View>
            ),
            type: 'primary'
          })
        }
      >
        自定义节点
      </Button>
    </View>
  );
};

export { NotifyCustom };
