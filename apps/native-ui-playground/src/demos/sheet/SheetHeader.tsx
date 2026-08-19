import { BottomSheetView, Button, Sheet, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SheetHeader = () => {
  const insets = useSafeAreaInsets();

  const [titleShow, setTitleShow] = useState(false);
  const [noTitleShow, setNoTitleShow] = useState(false);
  const [plainShow, setPlainShow] = useState(false);

  return (
    <View className="flex-row flex-wrap items-center gap-3 bg-background p-4">
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
  );
};

export { SheetHeader };
