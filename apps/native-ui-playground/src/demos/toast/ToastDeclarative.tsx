import { Button, Toast } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const ToastDeclarative = () => {
  const [declarativeShow, setDeclarativeShow] = useState(false);

  return (
    <View className="bg-background px-6 py-4">
      <View className="flex-row flex-wrap items-center gap-3">
        <Button
          variant="outline"
          onPress={() => setDeclarativeShow(true)}
        >
          显示受控 Toast
        </Button>
      </View>

      <View className="items-center">
        <Toast
          message="受控 Toast，2 秒后自动关闭"
          show={declarativeShow}
          type="success"
          onUpdateShow={setDeclarativeShow}
        />
      </View>
    </View>
  );
};

export { ToastDeclarative };
