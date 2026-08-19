import { Cell, CellGroup } from '@skyroc/native-ui';
import { Alert, View } from 'react-native';

function handlePress(label: string) {
  Alert.alert(label, '列表项已点击');
}

const CellGroupInset = () => {
  return (
    <View className="bg-muted py-4">
      <CellGroup
        inset
        classNames={{ root: 'border border-border/70 bg-background' }}
        title="通知设置"
      >
        <Cell
          title="系统通知"
          trailing="已开启"
        />
        <Cell
          title="活动提醒"
          trailing="仅重要"
        />
        <Cell
          showArrow
          title="通知偏好"
          onPress={() => handlePress('通知偏好')}
        />
      </CellGroup>
    </View>
  );
};

export { CellGroupInset };
