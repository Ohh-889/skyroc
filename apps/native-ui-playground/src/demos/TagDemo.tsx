import { Tag, Text } from '@skyroc/native-ui';
import { useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';

const COLORS = ['primary', 'destructive', 'secondary', 'success', 'warning', 'info'] as const;
const VARIANTS = ['solid', 'tonal', 'outline', 'ghost'] as const;

const TagDemo = () => {
  const [visible, setVisible] = useState(true);

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-6 pb-20"
      showsVerticalScrollIndicator={false}
    >
      {/* Variants */}
      <Text className="mb-4 text-lg font-semibold">Variants</Text>
      <View className="mb-8 flex-row flex-wrap items-center gap-3">
        {VARIANTS.map(v => (
          <Tag
            key={v}
            variant={v}
          >
            {v}
          </Tag>
        ))}
      </View>

      {/* Colors - Solid */}
      <Text className="mb-4 text-lg font-semibold">Colors (Solid)</Text>
      <View className="mb-8 flex-row flex-wrap items-center gap-3">
        {COLORS.map(c => (
          <Tag
            key={c}
            color={c}
          >
            {c}
          </Tag>
        ))}
      </View>

      {/* Colors - Tonal */}
      <Text className="mb-4 text-lg font-semibold">Colors (Tonal)</Text>
      <View className="mb-8 flex-row flex-wrap items-center gap-3">
        {COLORS.map(c => (
          <Tag
            key={c}
            color={c}
            variant="tonal"
          >
            {c}
          </Tag>
        ))}
      </View>

      {/* Colors - Outline */}
      <Text className="mb-4 text-lg font-semibold">Colors (Outline)</Text>
      <View className="mb-8 flex-row flex-wrap items-center gap-3">
        {COLORS.map(c => (
          <Tag
            key={c}
            color={c}
            variant="outline"
          >
            {c}
          </Tag>
        ))}
      </View>

      {/* Colors - Ghost */}
      <Text className="mb-4 text-lg font-semibold">Colors (Ghost)</Text>
      <View className="mb-8 flex-row flex-wrap items-center gap-3">
        {COLORS.map(c => (
          <Tag
            key={c}
            color={c}
            variant="ghost"
          >
            {c}
          </Tag>
        ))}
      </View>

      {/* Sizes */}
      <Text className="mb-4 text-lg font-semibold">Sizes</Text>
      <View className="mb-8 flex-row flex-wrap items-center gap-3">
        <Tag size="sm">Small</Tag>
        <Tag size="md">Medium</Tag>
        <Tag size="lg">Large</Tag>
      </View>

      {/* Shapes */}
      <Text className="mb-4 text-lg font-semibold">Shapes</Text>
      <View className="mb-8 flex-row flex-wrap items-center gap-3">
        <Tag shape="rounded">Rounded</Tag>
        <Tag shape="pill">Pill</Tag>
        <Tag shape="mark">Mark</Tag>
      </View>

      {/* Closeable */}
      <Text className="mb-4 text-lg font-semibold">Closeable</Text>
      <View className="mb-8 flex-row flex-wrap items-center gap-3">
        {visible ? (
          <Tag
            closeable
            onClose={() => setVisible(false)}
          >
            Click to close
          </Tag>
        ) : (
          <Text className="text-sm text-muted-foreground">Tag closed</Text>
        )}
        <Tag
          closeable
          color="success"
          onClose={() => Alert.alert('Close')}
        >
          Success
        </Tag>
        <Tag
          closeable
          color="warning"
          variant="tonal"
          onClose={() => Alert.alert('Close')}
        >
          Warning
        </Tag>
      </View>

      {/* Combined */}
      <Text className="mb-4 text-lg font-semibold">Combined</Text>
      <View className="mb-8 flex-row flex-wrap items-center gap-3">
        <Tag
          color="primary"
          shape="pill"
          size="sm"
          variant="tonal"
        >
          Small Pill
        </Tag>
        <Tag
          closeable
          color="destructive"
          shape="pill"
          variant="outline"
          onClose={() => Alert.alert('Close')}
        >
          Closeable Pill
        </Tag>
        <Tag
          color="success"
          shape="mark"
          size="lg"
        >
          Large Mark
        </Tag>
        <Tag
          color="info"
          shape="mark"
          variant="tonal"
        >
          Tonal Mark
        </Tag>
      </View>
    </ScrollView>
  );
};

export { TagDemo };
