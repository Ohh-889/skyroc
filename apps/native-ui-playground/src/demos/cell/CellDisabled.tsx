import { Cell } from '@skyroc/native-ui';
import { Alert, View } from 'react-native';

function handlePress(label: string) {
  Alert.alert(label, '列表项已点击');
}

const CellDisabled = () => {
  return (
    <View className="bg-muted p-4">
      <View className="overflow-hidden rounded-2xl border border-border/70 bg-background">
        <Cell
          disabled
          showArrow
          subtitle="禁用后不会触发点击事件"
          title="暂不可用"
          trailing="Disabled"
          onPress={() => handlePress('暂不可用')}
        />
      </View>
    </View>
  );
};

export { CellDisabled };
