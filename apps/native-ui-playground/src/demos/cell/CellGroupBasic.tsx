import { CellGroup, type CellGroupItem } from '@skyroc/native-ui';
import { Alert, View } from 'react-native';

function handlePress(label: string) {
  Alert.alert(label, '列表项已点击');
}

function handleMoreSettingsPress() {
  handlePress('更多设置');
}

const ITEMS: readonly CellGroupItem[] = [
  {
    key: 'profile',
    title: '个人资料',
    trailing: '已完善'
  },
  {
    key: 'security',
    title: '安全设置',
    trailing: '正常'
  },
  {
    key: 'more',
    showArrow: true,
    title: '更多设置',
    onPress: handleMoreSettingsPress
  }
];

const CellGroupBasic = () => {
  return (
    <View className="bg-muted p-4">
      <CellGroup
        classNames={{ root: 'border border-border/70 bg-background' }}
        items={ITEMS}
        title="账户设置"
      />
    </View>
  );
};

export { CellGroupBasic };
