import { Button, Popup, Text, showToast } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';
import { PopupPanel } from './shared';

/**
 * 默认 coverScreen 会开一个原生窗口，Portal 渲染的 Toast 会被挡在后面。 传 coverScreen={false} 让弹层就地渲染即可共存，代价是盖不住原生导航栏，且
 * Android 返回键不再生效。
 *
 * coverScreen={false} 渲染的是一个 absolute inset-0 的 View，定位相对父容器， 所以这里的根容器要有确定高度，弹层才有地方铺开。
 */
const PopupInline = () => {
  const [show, setShow] = useState(false);

  return (
    <View className="min-h-80 flex-1 bg-background p-4">
      <View className="flex-row flex-wrap items-center gap-3">
        <Button
          variant="tonal"
          onPress={() => setShow(true)}
        >
          就地渲染 + Toast
        </Button>
      </View>

      <Popup
        round
        coverScreen={false}
        position="bottom"
        show={show}
        onUpdateShow={setShow}
      >
        <PopupPanel
          title="就地渲染"
          onClose={() => setShow(false)}
        >
          <Text color="muted">下面这个 Toast 能盖在弹层之上</Text>
          <Button
            variant="tonal"
            onPress={() => showToast('Toast 在弹层上方')}
          >
            弹一条 Toast
          </Button>
        </PopupPanel>
      </Popup>
    </View>
  );
};

export { PopupInline };
