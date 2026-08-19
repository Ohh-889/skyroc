import { Cell } from '@skyroc/native-ui';
import { Alert, View } from 'react-native';

function handlePress(label: string) {
  Alert.alert(label, '列表项已点击');
}

const CellArrow = () => {
  return (
    <View className="bg-muted p-4">
      <View className="overflow-hidden rounded-2xl border border-border/70 bg-background">
        <Cell
          showArrow
          title="右箭头"
          onPress={() => handlePress('右箭头')}
        />
        <Cell
          showArrow
          arrowDirection="down"
          title="下箭头"
          trailing="展开"
          onPress={() => handlePress('下箭头')}
        />
        <Cell
          showArrow
          arrowDirection="up"
          title="上箭头"
          trailing="收起"
          onPress={() => handlePress('上箭头')}
        />
      </View>
    </View>
  );
};

export { CellArrow };
