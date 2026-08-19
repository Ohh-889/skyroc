import { Divider, Text } from '@skyroc/native-ui';
import { View } from 'react-native';

const DividerCustomStyle = () => {
  return (
    <View className="bg-background p-4">
      <Text className="text-xs text-muted-foreground">className 覆盖根容器</Text>
      <Divider className="rounded-lg bg-muted px-3 py-4" />

      <Text className="mt-4 text-xs text-muted-foreground">classNames 覆盖内部槽位</Text>
      <Divider
        align="start"
        classNames={{
          line: 'h-0.5 bg-border',
          lineLeading: 'max-w-[25%] bg-warning',
          lineTrailing: 'bg-primary',
          root: 'rounded-lg bg-muted px-2',
          text: 'font-medium text-primary'
        }}
        hairline={false}
      >
        自定义槽位
      </Divider>
    </View>
  );
};

export { DividerCustomStyle };
