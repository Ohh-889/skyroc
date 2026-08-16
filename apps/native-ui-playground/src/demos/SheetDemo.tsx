import { BottomSheetFlatList, BottomSheetView, Button, Cell, Sheet, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/** 列表示例的数据源，条数刻意多于一屏，用来验证面板内部滚动 */
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

const SheetDemo = () => {
  const insets = useSafeAreaInsets();

  const [basicShow, setBasicShow] = useState(false);
  const [titleShow, setTitleShow] = useState(false);
  const [noTitleShow, setNoTitleShow] = useState(false);
  const [plainShow, setPlainShow] = useState(false);
  const [snapShow, setSnapShow] = useState(false);
  const [listShow, setListShow] = useState(false);
  const [lockedShow, setLockedShow] = useState(false);
  const [tallShow, setTallShow] = useState(false);

  const [picked, setPicked] = useState('');

  function handlePick(city: string) {
    setPicked(city);
    setListShow(false);
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
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-6 pb-20"
      showsVerticalScrollIndicator={false}
    >
      {/* 基础用法 */}
      <Text className="mb-2 text-lg font-semibold">基础用法</Text>
      <Text
        className="mb-4"
        color="muted"
      >
        不传 snapPoints 时走动态尺寸，面板高度由内容自己撑开
      </Text>
      <View className="mb-8 flex-row flex-wrap items-center gap-3">
        <Button
          variant="tonal"
          onPress={() => setBasicShow(true)}
        >
          打开面板
        </Button>

        <Sheet
          show={basicShow}
          title="基础面板"
          onUpdateShow={setBasicShow}
        >
          <BottomSheetView
            className="gap-3 px-6"
            style={{ paddingBottom: insets.bottom + 24 }}
          >
            <Text color="muted">下拉、点遮罩、点右上角关闭按钮都能收起面板</Text>
            <Button
              variant="outline"
              onPress={() => setBasicShow(false)}
            >
              关闭
            </Button>
          </BottomSheetView>
        </Sheet>
      </View>

      {/* 标题与描述 */}
      <Text className="mb-2 text-lg font-semibold">标题与描述</Text>
      <Text
        className="mb-4"
        color="muted"
      >
        标题栏走 handleComponent，是固定不滚的顶部区，closeable 默认开启
      </Text>
      <View className="mb-8 flex-row flex-wrap items-center gap-3">
        <Button
          variant="tonal"
          onPress={() => setTitleShow(true)}
        >
          标题 + 描述
        </Button>

        <Sheet
          description="描述显示在标题下方，同属顶部固定区"
          show={titleShow}
          title="标题与描述"
          onUpdateShow={setTitleShow}
        >
          <BottomSheetView
            className="gap-3 px-6"
            style={{ paddingBottom: insets.bottom + 24 }}
          >
            <Text color="muted">标题居中，关闭按钮绝对定位在右侧，不参与居中计算</Text>
          </BottomSheetView>
        </Sheet>

        <Button
          variant="tonal"
          onPress={() => setNoTitleShow(true)}
        >
          只有关闭按钮
        </Button>

        {/* 没有 title 时 header 只剩关闭按钮，验证它不会压到下面的内容上 */}
        <Sheet
          show={noTitleShow}
          onUpdateShow={setNoTitleShow}
        >
          <BottomSheetView
            className="gap-3 px-6"
            style={{ paddingBottom: insets.bottom + 24 }}
          >
            <Text color="muted">没有标题，但 header 仍然撑出高度，关闭按钮不会盖住这行字</Text>
          </BottomSheetView>
        </Sheet>

        <Button
          variant="tonal"
          onPress={() => setPlainShow(true)}
        >
          无顶部区
        </Button>

        {/* handle / 标题 / 描述全空时，Sheet 会给 gorhom 传 handleComponent={null} */}
        <Sheet
          closeable={false}
          show={plainShow}
          showHandle={false}
          onUpdateShow={setPlainShow}
        >
          <BottomSheetView
            className="gap-3 px-6 pt-6"
            style={{ paddingBottom: insets.bottom + 24 }}
          >
            <Text color="muted">顶部固定区整块不渲染，handleHeight 直接置 0</Text>
            <Button
              variant="outline"
              onPress={() => setPlainShow(false)}
            >
              关闭
            </Button>
          </BottomSheetView>
        </Sheet>
      </View>

      {/* 吸附高度 */}
      <Text className="mb-2 text-lg font-semibold">吸附高度</Text>
      <Text
        className="mb-4"
        color="muted"
      >
        传了 snapPoints 高度就固定下来，可以在几档之间拖动
      </Text>
      <View className="mb-8 flex-row flex-wrap items-center gap-3">
        <Button
          variant="tonal"
          onPress={() => setSnapShow(true)}
        >
          40% / 75%
        </Button>

        <Sheet
          show={snapShow}
          snapPoints={['40%', '75%']}
          title="吸附高度"
          onUpdateShow={setSnapShow}
        >
          <BottomSheetView className="gap-3 px-6">
            <Text color="muted">往上拖到 75%，再往下拖回 40%，继续下拉才会关闭</Text>
          </BottomSheetView>
        </Sheet>
      </View>

      {/* 列表内容 */}
      <Text className="mb-2 text-lg font-semibold">列表内容</Text>
      <Text
        className="mb-4"
        color="muted"
      >
        长列表用 BottomSheetFlatList 直接当内容，底部留白写进 contentContainerStyle 才会跟着滚
      </Text>
      <View className="mb-2 flex-row flex-wrap items-center gap-3">
        <Button
          variant="tonal"
          onPress={() => setListShow(true)}
        >
          选择城市
        </Button>

        <Sheet
          show={listShow}
          snapPoints={['60%']}
          title="选择城市"
          onUpdateShow={setListShow}
        >
          <BottomSheetFlatList
            contentContainerStyle={{ paddingBottom: insets.bottom }}
            data={CITIES}
            keyExtractor={city => city}
            renderItem={renderCity}
          />
        </Sheet>
      </View>
      <Text
        className="mb-8"
        color="muted"
      >
        {picked ? `已选择：${picked}` : '还没选'}
      </Text>

      {/* 关闭行为 */}
      <Text className="mb-2 text-lg font-semibold">关闭行为</Text>
      <Text
        className="mb-4"
        color="muted"
      >
        关掉点遮罩和下拉之后，只剩右上角的关闭按钮这一条出口
      </Text>
      <View className="mb-8 flex-row flex-wrap items-center gap-3">
        <Button
          variant="tonal"
          onPress={() => setLockedShow(true)}
        >
          只能按按钮关闭
        </Button>

        <Sheet
          closeOnBackdropPress={false}
          enablePanDownToClose={false}
          show={lockedShow}
          title="锁定关闭"
          onUpdateShow={setLockedShow}
        >
          <BottomSheetView
            className="gap-3 px-6"
            style={{ paddingBottom: insets.bottom + 24 }}
          >
            <Text color="muted">点遮罩没反应，下拉也拉不走；Android 返回键仍然可以关闭</Text>
          </BottomSheetView>
        </Sheet>
      </View>

      {/* 动态尺寸 + 滚动 */}
      <Text className="mb-2 text-lg font-semibold">动态尺寸 + 滚动</Text>
      <Text
        className="mb-4"
        color="muted"
      >
        不传 snapPoints 也能滚：列表自己上报内容高度，长到屏幕上限后就在内部滚动
      </Text>
      <View className="mb-8 flex-row flex-wrap items-center gap-3">
        <Button
          variant="tonal"
          onPress={() => setTallShow(true)}
        >
          很长的内容
        </Button>

        <Sheet
          show={tallShow}
          title="超长内容"
          onUpdateShow={setTallShow}
        >
          <BottomSheetFlatList
            contentContainerStyle={{ paddingBottom: insets.bottom }}
            data={CITIES}
            keyExtractor={city => city}
            renderItem={renderCity}
          />
        </Sheet>
      </View>
    </ScrollView>
  );
};

export { SheetDemo };
