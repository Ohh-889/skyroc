import { FieldGroup, FieldItem, Input, Text } from '@skyroc/native-ui';
import { View } from 'react-native';

const FieldGap = () => {
  return (
    <View className="gap-4 bg-background p-4">
      <View className="rounded-xl border border-border p-3">
        <Text className="mb-3 text-sm font-medium text-foreground">gap=2</Text>
        <FieldGroup gap={2}>
          <FieldItem
            label="字段一"
            name="compactFirst"
            size="sm"
          >
            <Input size="sm" />
          </FieldItem>
          <FieldItem
            label="字段二"
            name="compactSecond"
            size="sm"
          >
            <Input size="sm" />
          </FieldItem>
        </FieldGroup>
      </View>

      <View className="rounded-xl border border-border p-3">
        <Text className="mb-3 text-sm font-medium text-foreground">gap=8</Text>
        <FieldGroup gap={8}>
          <FieldItem
            label="字段一"
            name="looseFirst"
            size="sm"
          >
            <Input size="sm" />
          </FieldItem>
          <FieldItem
            label="字段二"
            name="looseSecond"
            size="sm"
          >
            <Input size="sm" />
          </FieldItem>
        </FieldGroup>
      </View>
    </View>
  );
};

export { FieldGap };
