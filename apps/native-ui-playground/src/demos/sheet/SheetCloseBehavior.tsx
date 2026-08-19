import { BottomSheetView, Button, Sheet, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SheetCloseBehavior = () => {
  const insets = useSafeAreaInsets();

  const [show, setShow] = useState(false);

  return (
    <View className="flex-row flex-wrap items-center gap-3 bg-background p-4">
      <Button
        variant="tonal"
        onPress={() => setShow(true)}
      >
        只能按按钮关闭
      </Button>

      <Sheet
        closeOnBackdropPress={false}
        enablePanDownToClose={false}
        show={show}
        title="锁定关闭"
        onUpdateShow={setShow}
      >
        <BottomSheetView
          className="gap-3 px-6"
          style={{ paddingBottom: insets.bottom + 24 }}
        >
          <Text color="muted">点遮罩没反应，下拉也拉不走；Android 返回键仍然可以关闭</Text>
        </BottomSheetView>
      </Sheet>
    </View>
  );
};

export { SheetCloseBehavior };
