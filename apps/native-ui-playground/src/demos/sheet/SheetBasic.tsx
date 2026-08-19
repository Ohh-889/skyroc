import { BottomSheetView, Button, Sheet, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const SheetBasic = () => {
  const [show, setShow] = useState(false);

  return (
    <View className="flex-row flex-wrap items-center gap-3 bg-background p-4">
      <Button
        variant="tonal"
        onPress={() => setShow(true)}
      >
        打开面板
      </Button>

      <Sheet
        show={show}
        title="基础面板"
        onUpdateShow={setShow}
      >
        <BottomSheetView className="gap-3 px-6 pb-safe-offset-6">
          <Text color="muted">下拉、点遮罩、点右上角关闭按钮都能收起面板</Text>
          <Button
            variant="outline"
            onPress={() => setShow(false)}
          >
            关闭
          </Button>
        </BottomSheetView>
      </Sheet>
    </View>
  );
};

export { SheetBasic };
