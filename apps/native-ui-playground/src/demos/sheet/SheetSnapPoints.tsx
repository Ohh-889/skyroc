import { BottomSheetView, Button, Sheet, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const SheetSnapPoints = () => {
  const [show, setShow] = useState(false);

  return (
    <View className="flex-row flex-wrap items-center gap-3 bg-background p-4">
      <Button
        variant="tonal"
        onPress={() => setShow(true)}
      >
        40% / 75%
      </Button>

      <Sheet
        show={show}
        snapPoints={['40%', '75%']}
        title="吸附高度"
        onUpdateShow={setShow}
      >
        <BottomSheetView className="gap-3 px-6">
          <Text color="muted">往上拖到 75%，再往下拖回 40%，继续下拉才会关闭</Text>
        </BottomSheetView>
      </Sheet>
    </View>
  );
};

export { SheetSnapPoints };
