import { Button, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';

const ButtonDemo = () => {
  const [loading, setLoading] = useState(false);

  function handleLoadingPress() {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  }

  return (
    <ScrollView className="flex-1 bg-background p-6">
      {/* Variants */}
      <Text className="mb-4 text-lg font-semibold">Variants</Text>
      <View className="mb-8 gap-3">
        <Button
          variant="solid"
          onPress={() => Alert.alert('Solid')}
        >
          Solid
        </Button>
        <Button variant="tonal">Tonal</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
      </View>

      {/* Colors */}
      <Text className="mb-4 text-lg font-semibold">Colors</Text>
      <View className="mb-8 gap-3">
        <Button color="primary">Primary</Button>
        <Button color="secondary">Secondary</Button>
        <Button color="destructive">Destructive</Button>
        <Button color="success">Success</Button>
        <Button color="warning">Warning</Button>
        <Button color="info">Info</Button>
      </View>

      {/* Tonal Colors */}
      <Text className="mb-4 text-lg font-semibold">Tonal Colors</Text>
      <View className="mb-8 gap-3">
        <Button
          variant="tonal"
          color="primary"
        >
          Primary
        </Button>
        <Button
          variant="tonal"
          color="destructive"
        >
          Destructive
        </Button>
        <Button
          variant="tonal"
          color="success"
        >
          Success
        </Button>
        <Button
          variant="tonal"
          color="warning"
        >
          Warning
        </Button>
        <Button
          variant="tonal"
          color="info"
        >
          Info
        </Button>
      </View>

      {/* Sizes */}
      <Text className="mb-4 text-lg font-semibold">Sizes</Text>
      <View className="mb-8 gap-3">
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </View>

      {/* Shapes */}
      <Text className="mb-4 text-lg font-semibold">Shapes</Text>
      <View className="mb-8 flex-row gap-3">
        <Button shape="rounded">Rounded</Button>
        <Button shape="pill">Pill</Button>
        <Button
          shape="circle"
          size="icon"
        >
          <Text>A</Text>
        </Button>
      </View>

      {/* States */}
      <Text className="mb-4 text-lg font-semibold">States</Text>
      <View className="mb-8 gap-3">
        <Button disabled>Disabled</Button>
        <Button
          loading={loading}
          onPress={handleLoadingPress}
        >
          {loading ? 'Loading...' : 'Click to Load'}
        </Button>
      </View>
    </ScrollView>
  );
};

export { ButtonDemo };
