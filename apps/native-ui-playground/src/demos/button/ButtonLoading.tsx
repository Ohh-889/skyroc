import { Button } from '@skyroc/native-ui';
import { useState } from 'react';
import { View } from 'react-native';

const ButtonLoading = () => {
  const [loading, setLoading] = useState(false);

  function handlePress() {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  }

  return (
    <View className="gap-3 bg-background p-4">
      <Button
        loading={loading}
        variant="tonal"
        onPress={handlePress}
      >
        {loading ? '提交中…' : '点击提交'}
      </Button>

      {/* 指示器颜色跟随 variant / color，与文字色保持一致 */}
      <Button
        loading
        variant="tonal"
      >
        tonal 加载
      </Button>
      <Button
        loading
        variant="outline"
      >
        outline 加载
      </Button>
    </View>
  );
};

export { ButtonLoading };
