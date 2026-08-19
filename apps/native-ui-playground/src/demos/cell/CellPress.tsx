import { Cell } from '@skyroc/native-ui';
import { Alert, View } from 'react-native';

function handlePress(label: string) {
  Alert.alert(label, '列表项已点击');
}

const CellPress = () => {
  return (
    <View className="bg-muted p-4">
      <View className="overflow-hidden rounded-2xl border border-border/70 bg-background">
        <Cell
          title="可点击列表项"
          onPress={() => handlePress('可点击列表项')}
        />
        <Cell
          showArrow
          subtitle="也可以通过 showArrow 显式控制"
          title="显式显示箭头"
          onPress={() => handlePress('显式显示箭头')}
        />
      </View>
    </View>
  );
};

export { CellPress };
