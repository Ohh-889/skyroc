import { Cell, CellGroup } from '@skyroc/native-ui';
import { Alert, View } from 'react-native';

function handlePress(label: string) {
  Alert.alert(label, '列表项已点击');
}

const CellGroupBasic = () => {
  return (
    <View className="bg-muted p-4">
      <CellGroup
        classNames={{ root: 'border border-border/70 bg-background' }}
        title="账户设置"
      >
        <Cell
          title="个人资料"
          trailing="已完善"
        />
        <Cell
          title="安全设置"
          trailing="正常"
        />
        <Cell
          showArrow
          title="更多设置"
          onPress={() => handlePress('更多设置')}
        />
      </CellGroup>
    </View>
  );
};

export { CellGroupBasic };
