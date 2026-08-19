import { Button, Popup, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';
import { PopupPanel } from './shared';

/** CloseOnBackdropPress 与 closeOnBackPress 相互独立：点遮罩关不掉时，Android 返回键仍然可以退出 */
const PopupBackdrop = () => {
  const [lockedShow, setLockedShow] = useState(false);
  const [backLockedShow, setBackLockedShow] = useState(false);
  const [backdropShow, setBackdropShow] = useState(false);

  return (
    <View className="flex-row flex-wrap items-center gap-3 bg-background p-4">
      <Button
        variant="tonal"
        onPress={() => setLockedShow(true)}
      >
        点遮罩不关闭
      </Button>
      <Button
        variant="tonal"
        onPress={() => setBackLockedShow(true)}
      >
        返回键不关闭
      </Button>
      <Button
        variant="tonal"
        onPress={() => setBackdropShow(true)}
      >
        自定义遮罩
      </Button>

      <Popup
        round
        closeOnBackdropPress={false}
        position="center"
        show={lockedShow}
        onUpdateShow={setLockedShow}
      >
        <PopupPanel
          title="点遮罩不关闭"
          onClose={() => setLockedShow(false)}
        >
          <Text color="muted">只能点下面的按钮，或按 Android 返回键</Text>
        </PopupPanel>
      </Popup>

      <Popup
        round
        closeOnBackPress={false}
        position="center"
        show={backLockedShow}
        onUpdateShow={setBackLockedShow}
      >
        <PopupPanel
          title="Android 返回键不关闭"
          onClose={() => setBackLockedShow(false)}
        >
          <Text color="muted">点击遮罩或面板按钮仍可关闭</Text>
        </PopupPanel>
      </Popup>

      <Popup
        round
        backdropColor="#1d4ed8"
        backdropOpacity={0.75}
        position="center"
        show={backdropShow}
        onUpdateShow={setBackdropShow}
      >
        <PopupPanel
          title="自定义遮罩"
          onClose={() => setBackdropShow(false)}
        >
          <Text color="muted">backdropColor #1d4ed8，backdropOpacity 0.75</Text>
        </PopupPanel>
      </Popup>
    </View>
  );
};

export { PopupBackdrop };
