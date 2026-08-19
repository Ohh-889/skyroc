import { BottomSheetFlatList, Button, Cell, Sheet } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/** 条数刻意多于一屏，用来验证动态尺寸下的内部滚动 */
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

/** 列表项只用来撑高内容，不接管点击 */
function renderCity(info: { item: string }) {
  return (
    <Cell
      showArrow
      title={info.item}
    />
  );
}

const SheetDynamicHeight = () => {
  const insets = useSafeAreaInsets();

  const [show, setShow] = useState(false);

  return (
    <View className="flex-row flex-wrap items-center gap-3 bg-background p-4">
      <Button
        variant="tonal"
        onPress={() => setShow(true)}
      >
        很长的内容
      </Button>

      <Sheet
        show={show}
        title="超长内容"
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
  );
};

export { SheetDynamicHeight };
