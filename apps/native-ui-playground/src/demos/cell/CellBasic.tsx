import { Cell } from '@skyroc/native-ui';
import { View } from 'react-native';

const CellBasic = () => {
  return (
    <View className="bg-muted p-4">
      <View className="overflow-hidden rounded-2xl border border-border/70 bg-background">
        <Cell title="单行标题" />
        <Cell
          subtitle="用于补充说明当前内容"
          title="带描述信息"
        />
        <Cell
          subtitle="标题、描述与右侧内容可以同时使用"
          title="完整信息"
          trailing="详情"
        />
      </View>
    </View>
  );
};

export { CellBasic };
