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
    <View className="gap-3 bg-background p-6">
      <Button
        loading={loading}
        onPress={handlePress}
      >
        {loading ? 'Submitting…' : 'Tap to Submit'}
      </Button>

      {/* 指示器颜色跟随 variant / color，与文字色保持一致 */}
      <Button
        loading
        variant="tonal"
      >
        Tonal
      </Button>
      <Button
        loading
        color="destructive"
        variant="outline"
      >
        Outline
      </Button>
    </View>
  );
};

export { ButtonLoading };
