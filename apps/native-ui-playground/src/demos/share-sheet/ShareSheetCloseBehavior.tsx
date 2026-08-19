import AntDesign from '@expo/vector-icons/AntDesign';
import type { ShareSheetOption } from '@skyroc/native-ui';
import { BottomSheetModal, Button, ShareSheet } from '@skyroc/native-ui';
import type { ComponentRef } from 'react';
import { useRef, useState } from 'react';
import { View } from 'react-native';

const OPTIONS: ShareSheetOption[] = [
  {
    icon: (
      <AntDesign
        color="var(--foreground)"
        name="check-circle"
        size={22}
      />
    ),
    name: '确认',
    value: 'confirm'
  }
];

const ShareSheetCloseBehavior = () => {
  const [show, setShow] = useState(false);

  const sheetRef = useRef<ComponentRef<typeof BottomSheetModal>>(null);

  function handleOpenAndDismissByRef() {
    setShow(true);
    setTimeout(() => sheetRef.current?.dismiss(), 2500);
  }

  return (
    <View className="bg-background p-4">
      <Button
        variant="tonal"
        onPress={() => setShow(true)}
      >
        仅保留取消入口
      </Button>
      <Button
        className="mt-3"
        variant="outline"
        onPress={handleOpenAndDismissByRef}
      >
        打开后用 ref 关闭
      </Button>

      <ShareSheet
        ref={sheetRef}
        cancelText="关闭面板"
        closeable={false}
        closeOnBackdropPress={false}
        enablePanDownToClose={false}
        options={OPTIONS}
        show={show}
        showHandle={false}
        title="关闭行为"
        onUpdateShow={setShow}
      />
    </View>
  );
};

export { ShareSheetCloseBehavior };
