import { Cell } from '@skyroc/native-ui';
import { View } from 'react-native';

const CellCenter = () => {
  return (
    <View className="gap-3 bg-muted p-4">
      <View className="overflow-hidden rounded-2xl border border-border/70 bg-background">
        <Cell
          subtitle="默认 center 为 true，标题与右侧内容整体垂直居中，副标题较长时右侧文字会落在中间。"
          title="居中对齐"
          trailing="默认"
        />
      </View>

      <View className="overflow-hidden rounded-2xl border border-border/70 bg-background">
        <Cell
          center={false}
          subtitle="center 传 false 后各区域顶部对齐，多行副标题的场景下右侧内容与标题在同一行。"
          title="顶部对齐"
          trailing="center=false"
        />
      </View>
    </View>
  );
};

export { CellCenter };
