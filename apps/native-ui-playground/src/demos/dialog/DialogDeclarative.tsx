import { Button, Dialog, Portal } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const DialogDeclarative = () => {
  const [declarativeShow, setDeclarativeShow] = useState(false);
  const [inputShow, setInputShow] = useState(false);

  return (
    <View className="bg-background px-6">
      <View className="mb-8 flex-row flex-wrap items-center gap-3">
        <Button
          variant="outline"
          onPress={() => setDeclarativeShow(true)}
        >
          受控 Dialog
        </Button>
        <Button
          variant="outline"
          onPress={() => setInputShow(true)}
        >
          受控 + 输入框
        </Button>
      </View>

      {/* 声明式 Dialog 不能落在 ScrollView 里面：JS 触摸响应链走的是 React 树，
          键盘弹起时 ScrollView 会在 capture 阶段抢走第一次点击用来收键盘（keyboardShouldPersistTaps 默认 never），
          放在里面的话带输入框的弹窗要点两下才关得掉。这里套 Portal，让它们改挂到 PortalHost 下，
          总览页把本 demo 放进 ScrollView 时也不受影响 */}
      <Portal>
        <Dialog
          message="受控用法下 show 由外部状态驱动"
          show={declarativeShow}
          showCancelButton
          title="受控 Dialog"
          onUpdateShow={setDeclarativeShow}
        />

        <Dialog
          inputPlaceholder="随便输点什么"
          message="确定后能拿到输入值"
          show={inputShow}
          showCancelButton
          showInput
          title="受控输入"
          onUpdateShow={setInputShow}
        />
      </Portal>
    </View>
  );
};

export { DialogDeclarative };
