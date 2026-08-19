import { Divider, Space, Text } from '@skyroc/native-ui';
import { View } from 'react-native';

const SpaceSplit = () => {
  return (
    <View className="bg-background p-4">
      <Space
        direction="vertical"
        fill
        size="lg"
      >
        <View>
          <Text className="mb-3 text-xs text-muted-foreground">水平排列配合竖向分隔线</Text>
          <Space
            size="sm"
            split={<Divider orientation="vertical" />}
          >
            <Text className="text-sm">编辑</Text>
            <Text className="text-sm">复制</Text>
            <Text className="text-sm text-destructive">删除</Text>
          </Space>
        </View>

        <View>
          <Text className="mb-3 text-xs text-muted-foreground">垂直排列配合横向分隔线</Text>
          <Space
            direction="vertical"
            fill
            size="sm"
            split={<Divider />}
          >
            <Text className="text-sm">第一行</Text>
            <Text className="text-sm">第二行</Text>
            <Text className="text-sm">第三行</Text>
          </Space>
        </View>

        <View>
          <Text className="mb-3 text-xs text-muted-foreground">size=0 时，间距完全由分隔符承担</Text>
          <Space
            size={0}
            split={
              <Divider
                className="mx-3"
                orientation="vertical"
              />
            }
          >
            <Text className="text-sm">编辑</Text>
            <Text className="text-sm">复制</Text>
            <Text className="text-sm text-destructive">删除</Text>
          </Space>
        </View>
      </Space>
    </View>
  );
};

export { SpaceSplit };
