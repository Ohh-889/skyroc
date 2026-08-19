import { Grid, Text } from '@skyroc/native-ui';
import { View } from 'react-native';
import { DemoIcon } from './shared';

const GridCustomContent = () => {
  return (
    <View className="bg-background p-4">
      <View className="overflow-hidden rounded-xl border border-border">
        <Grid
          columnNum={2}
          items={[
            {
              children: (
                <View className="w-full rounded-xl bg-primary/10 p-3">
                  <Text className="text-sm font-semibold text-primary">自定义内容</Text>
                  <Text className="mt-1 text-xs text-muted-foreground">可承载任意 ReactNode</Text>
                </View>
              ),
              key: 'custom'
            },
            {
              icon: (
                <DemoIcon
                  label="0"
                  tone="success"
                />
              ),
              key: 'zero',
              text: 0
            }
          ]}
        />
      </View>
    </View>
  );
};

export { GridCustomContent };
