import { BottomSheetFlatList, Button, Cell, Sheet, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/** 条数刻意多于一屏，用来验证面板内部滚动 */
const CITIES = [
  '北京',
  '上海',
  '广州',
  '深圳',
  '杭州',
  '成都',
  '武汉',
  '西安',
  '南京',
  '重庆',
  '苏州',
  '天津',
  '长沙',
  '青岛',
  '厦门',
  '合肥'
];

const SheetList = () => {
  const insets = useSafeAreaInsets();

  const [show, setShow] = useState(false);
  const [picked, setPicked] = useState('');

  function handlePick(city: string) {
    setPicked(city);
    setShow(false);
  }

  function renderCity(info: { item: string }) {
    return (
      <Cell
        showArrow
        title={info.item}
        onPress={() => handlePick(info.item)}
      />
    );
  }

  return (
    <View className="gap-2 bg-background p-4">
      <View className="flex-row flex-wrap items-center gap-3">
        <Button
          variant="tonal"
          onPress={() => setShow(true)}
        >
          选择城市
        </Button>

        <Sheet
          show={show}
          snapPoints={['60%']}
          title="选择城市"
          onUpdateShow={setShow}
        >
          <BottomSheetFlatList
            contentContainerStyle={{ paddingBottom: insets.bottom }}
            data={CITIES}
            keyExtractor={city => city}
            renderItem={renderCity}
          />
        </Sheet>
      </View>

      <Text color="muted">{picked ? `已选择：${picked}` : '还没选'}</Text>
    </View>
  );
};

export { SheetList };
