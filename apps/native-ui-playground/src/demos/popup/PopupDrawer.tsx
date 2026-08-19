import { Button, Popup, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';
import { PopupPanel } from './shared';

const PopupDrawer = () => {
  const [show, setShow] = useState(false);

  return (
    <View className="flex-row flex-wrap items-center gap-3 bg-background p-4">
      <Button
        variant="tonal"
        onPress={() => setShow(true)}
      >
        半宽抽屉（w-1/2）
      </Button>

      <Popup
        round
        className="w-1/2"
        position="left"
        show={show}
        onUpdateShow={setShow}
      >
        <PopupPanel
          title="半宽抽屉"
          onClose={() => setShow(false)}
        >
          <Text color="muted">className 覆盖掉了默认的 w-3/4</Text>
        </PopupPanel>
      </Popup>
    </View>
  );
};

export { PopupDrawer };
