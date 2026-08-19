import { Button, Popup, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';
import { PopupPanel } from './shared';

const PopupSurface = () => {
  const [show, setShow] = useState(false);

  return (
    <View className="flex-row flex-wrap items-center gap-3 bg-background p-4">
      <Button
        variant="tonal"
        onPress={() => setShow(true)}
      >
        透明容器 + 自绘卡片
      </Button>

      <Popup
        className="w-[85%] max-w-[320px]"
        position="center"
        show={show}
        surface={false}
        onUpdateShow={setShow}
      >
        {/* 卡片自己画背景和圆角，容器只负责定位 */}
        <View className="overflow-hidden rounded-3xl bg-background">
          <PopupPanel
            title="自绘卡片"
            onClose={() => setShow(false)}
          >
            <Text color="muted">圆角来自卡片本身，容器是透明的</Text>
          </PopupPanel>
        </View>
      </Popup>
    </View>
  );
};

export { PopupSurface };
