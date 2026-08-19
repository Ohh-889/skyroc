import { Button, Notify } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const NotifyDeclarative = () => {
  const [declarativeShow, setDeclarativeShow] = useState(false);

  return (
    <View className="bg-background p-4">
      <View className="flex-row flex-wrap items-center gap-3">
        <Button
          variant="outline"
          onPress={() => setDeclarativeShow(true)}
        >
          显示受控 Notify
        </Button>
      </View>

      <Notify
        message="受控 Notify，3 秒后自动关闭"
        show={declarativeShow}
        type="success"
        onUpdateShow={setDeclarativeShow}
      />
    </View>
  );
};

export { NotifyDeclarative };
